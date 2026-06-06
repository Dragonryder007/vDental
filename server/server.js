import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cron from 'node-cron';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { initDb, dbRun, dbAll, dbGet, normalizeAppointmentSlot } from '../database/db.js';
import { SEED_BLOG_POSTS } from './seedBlogPosts.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', true);
app.use(cors());
// Allow up to ~12MB JSON so the AI Preview can ship base64-encoded photos.
app.use(bodyParser.json({ limit: '12mb' }));

// ----------------------------
// Email (SMTP) - for localhost + production
// ----------------------------
function getSmtpConfig() {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM,
    SMTP_SERVICE
  } = process.env;

  const hasService = Boolean(SMTP_SERVICE && SMTP_USER && SMTP_PASS);
  const hasHost = Boolean(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS);
  if (!hasService && !hasHost) return null;

  return {
    service: SMTP_SERVICE || undefined,
    host: SMTP_HOST || undefined,
    port: SMTP_PORT ? Number(SMTP_PORT) : undefined,
    secure: SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    from: SMTP_FROM || SMTP_USER
  };
}

let cachedMailer = null;
function getMailer() {
  const cfg = getSmtpConfig();
  if (!cfg) return null;
  if (cachedMailer) return cachedMailer;

  const transporter = nodemailer.createTransport({
    service: cfg.service,
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: cfg.auth
  });

  cachedMailer = { transporter, from: cfg.from };
  return cachedMailer;
}

let cachedTestMailerPromise = null;
async function getTestMailer() {
  if (cachedTestMailerPromise) return cachedTestMailerPromise;
  cachedTestMailerPromise = (async () => {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass }
    });
    return { transporter, from: `V Dental and Implant Center <${testAccount.user}>`, testAccount };
  })();
  return cachedTestMailerPromise;
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

async function sendAppointmentConfirmationEmail({ to, appointment, confirmationNumber }) {
  const mailer = getMailer();
  const toEmail = normalizeEmail(to);
  const usingTestMailer = !mailer;
  if (!toEmail) return { attempted: false, sent: false, reason: 'missing_email' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
    return { attempted: false, sent: false, reason: 'invalid_email' };
  }

  const subject = `SmileVista Appointment Confirmation (${confirmationNumber})`;
  const text = [
    `Hi ${appointment.name},`,
    '',
    'Your appointment has been booked. Here are the details:',
    '',
    `Confirmation: ${confirmationNumber}`,
    `Name: ${appointment.name}`,
    `Phone: ${appointment.phone}`,
    `Date: ${appointment.date}`,
    `Time: ${appointment.time}`,
    `Service: ${appointment.service || '-'}`,
    `Issue: ${appointment.issue || '-'}`,
    '',
    '— V Dental and Implant Center'
  ].join('\n');

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <p>Hi <strong>${appointment.name}</strong>,</p>
      <p>Your appointment has been booked. Here are the details:</p>
      <table cellpadding="6" cellspacing="0" border="0" style="border-collapse: collapse;">
        <tr><td><strong>Confirmation</strong></td><td>${confirmationNumber}</td></tr>
        <tr><td><strong>Name</strong></td><td>${appointment.name}</td></tr>
        <tr><td><strong>Phone</strong></td><td>${appointment.phone}</td></tr>
        <tr><td><strong>Date</strong></td><td>${appointment.date}</td></tr>
        <tr><td><strong>Time</strong></td><td>${appointment.time}</td></tr>
        <tr><td><strong>Service</strong></td><td>${appointment.service || '-'}</td></tr>
        <tr><td><strong>Issue</strong></td><td>${appointment.issue || '-'}</td></tr>
      </table>
      <p>— V Dental and Implant Center</p>
    </div>
  `;

  try {
    const activeMailer = mailer || (await getTestMailer());
    const info = await activeMailer.transporter.sendMail({
      from: activeMailer.from,
      to: toEmail,
      subject,
      text,
      html
    });

    const previewUrl = nodemailer.getTestMessageUrl(info) || null;
    if (usingTestMailer) {
      return { attempted: true, sent: true, mode: 'ethereal', previewUrl, messageId: info?.messageId };
    }
    return { attempted: true, sent: true, mode: 'smtp', messageId: info?.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { attempted: true, sent: false, reason: 'send_failed' };
  }
}

async function sendReminderEmail({ to, appointment }) {
  const mailer = getMailer();
  const toEmail = normalizeEmail(to);
  if (!mailer || !toEmail) return { sent: false };

  const subject = `Reminder: Your Appointment Tomorrow with SmileVista`;
  const text = `Hi ${appointment.name}, this is a reminder for your appointment tomorrow, ${appointment.date} at ${appointment.time}. We look forward to seeing you!`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <p>Hi <strong>${appointment.name}</strong>,</p>
      <p>This is a friendly reminder for your appointment tomorrow:</p>
      <p><strong>Date:</strong> ${appointment.date}<br>
      <strong>Time:</strong> ${appointment.time}</p>
      <p>We look forward to seeing you!</p>
      <p>— V Dental and Implant Center</p>
    </div>
  `;

  try {
    await mailer.transporter.sendMail({ from: mailer.from, to: toEmail, subject, text, html });
    return { sent: true };
  } catch (error) {
    console.error('Reminder email error:', error);
    return { sent: false };
  }
}

// ----------------------------
// Paths / static
// ----------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');
const aiPreviewUploadsDir = path.join(uploadsDir, 'ai-preview');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(aiPreviewUploadsDir)) fs.mkdirSync(aiPreviewUploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

function writeBase64ImageToUploads(base64, mimeType, prefix) {
  const ext =
    mimeType?.includes('png') ? 'png' : mimeType?.includes('webp') ? 'webp' : 'jpg';
  const buf = Buffer.from(base64, 'base64');
  const filename = `${prefix}_${Date.now()}_${Math.round(Math.random() * 1e9)}.${ext}`;
  const filePath = path.join(aiPreviewUploadsDir, filename);
  fs.writeFileSync(filePath, buf);
  return `/uploads/ai-preview/${filename}`;
}

function writeDataUrlImageToUploads(dataUrl, prefix) {
  if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) return null;
  const m = dataUrl.match(/^data:([^;,]+);base64,(.+)$/);
  if (!m) return null;
  return writeBase64ImageToUploads(m[2], m[1], prefix);
}

function deleteAiPreviewFiles(row) {
  if (!row) return;
  for (const url of [row.beforeImageUrl, row.afterImageUrl]) {
    if (!url || typeof url !== 'string') continue;
    const base = path.basename(url);
    const filePath = path.join(aiPreviewUploadsDir, base);
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch {
      /* ignore */
    }
  }
}

// ----------------------------
// Database (MySQL) — must be ready before accepting traffic
// ----------------------------
let dbReady = false;

// Gallery schema is handled in initial creation for MySQL

// In-memory storage (non-persistent)
let assessments = [];
let chatHistory = [];

// ----------------------------
// Admin auth (fixed creds)
// ----------------------------
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const JWT_SECRET = process.env.JWT_SECRET || 'smilevista-dev-secret';
const JWT_EXPIRES_IN = '7d';

function requireAdmin(req, res, next) {
  const auth = req.headers.authorization || '';
  const [type, token] = auth.split(' ');
  if (type !== 'Bearer' || !token) return res.status(401).json({ success: false, error: 'Unauthorized' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload?.role !== 'admin') return res.status(403).json({ success: false, error: 'Forbidden' });
    req.admin = payload;
    return next();
  } catch (e) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
}

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
  const token = jwt.sign({ role: 'admin', username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return res.json({ success: true, token });
});

// ----------------------------
// Uploads (gallery)
// ----------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const safeBase = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const unique = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}_${safeBase}`);
  }
});
const upload = multer({ storage });

/** Run multer only for multipart blog uploads; JSON body works for text-only edits */
function blogUploadOptional(req, res, next) {
  const ct = req.headers['content-type'] || '';
  if (ct.includes('multipart/form-data')) {
    return upload.single('featuredImage')(req, res, next);
  }
  next();
}

// ============================================
// STEP 3: AI SMILE PREVIEW API (Gemini-powered)
// ============================================
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const GEMINI_IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';
const GEMINI_IMAGE_MODEL_FALLBACKS = (process.env.GEMINI_IMAGE_MODEL_FALLBACKS || 'gemini-3.1-flash-image-preview,gemini-3-pro-image-preview')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);
// Set GEMINI_IMAGE_PREVIEW=false to disable AI before/after image generation.
const GEMINI_IMAGE_PREVIEW = String(process.env.GEMINI_IMAGE_PREVIEW ?? 'true').toLowerCase() !== 'false';

function parseGeminiFailure(status, errText) {
  const reason = status === 429 ? 'quota_exceeded' : `gemini_${status}`;
  let detail = '';
  try {
    const parsed = JSON.parse(errText);
    detail = parsed?.error?.message || '';
  } catch {
    detail = errText.slice(0, 400);
  }
  if (status === 429) {
    // Still on free tier — billing not linked to this API key's project (limit: 0).
    if (/free_tier/i.test(detail) && /limit:\s*0\b/i.test(detail)) {
      return { reason: 'billing_required', detail };
    }
    if (/limit:\s*0\b/i.test(detail) && /image|preview-image/i.test(detail)) {
      return { reason: 'billing_required', detail };
    }
    if (/limit:\s*0\b/i.test(detail)) {
      return { reason: 'billing_required', detail };
    }
    if (/free_tier_input_token_count/i.test(detail)) {
      return { reason: 'quota_input_tokens', detail };
    }
    if (/free_tier/i.test(detail)) {
      return { reason: 'quota_free_tier', detail };
    }
    return { reason: 'quota_exceeded', detail };
  }
  return { reason, detail };
}

const SMILE_IMAGE_PROMPT = `You are a cosmetic dental smile preview tool for a dental clinic website.
The user uploaded a photo of their face with their teeth visible.

Create ONE photorealistic "after treatment" version of THIS SAME photo:
- Keep the exact same person, face shape, skin, eyes, nose, hair, pose, and background
- Only improve the visible smile: whiter, cleaner teeth; subtly straighter if crooked; natural gums
- Result must look like a realistic cosmetic dentistry simulation, not a cartoon
- Do not add text, watermarks, or borders

This is illustrative marketing only, not a medical outcome guarantee.`;

const SMILE_ANALYSIS_PROMPT = `You are an AI cosmetic-dental assistant for a smile-preview tool at V Dental and Implant Center.
Look at the visible teeth/smile in the photo. Be friendly, accurate, and concise.
You are NOT diagnosing medical conditions; you are suggesting cosmetic and corrective treatment OPTIONS only.
Map every recommendation to ONE of these clinic service codes (use the code exactly):
- "smile-designing"  (digital smile design, veneers, bonding, whitening, cosmetic shaping)
- "aligners-braces"  (clear aligners, braces, orthodontic alignment, gap closure)
- "dental-implants"  (missing teeth replacement, implants, full-mouth rehab)
- "general"          (cleaning, hygiene, routine checkup, anything outside the three above)

Return STRICT JSON matching this exact shape (no extra keys, no markdown):
{
  "concerns": string[],
  "strengths": string[],
  "recommendations": [{ "treatment": string, "service": string, "reason": string }],
  "costRangeINR": string,
  "timeline": string,
  "narrative": string
}

Rules:
- "concerns" and "strengths" are short bullet phrases (max ~12 words each).
- "recommendations" must contain 1-4 items. "service" MUST be one of the four codes above.
- "costRangeINR" is a free-text estimate (e.g. "₹25,000 – ₹1,20,000") or "" if unsure.
- "timeline" is a free-text duration (e.g. "1-2 weeks", "3-6 months") or "" if unsure.
- "narrative" is 2-3 friendly sentences summarising the suggested plan.
- If teeth are NOT clearly visible, return:
  concerns = ["Teeth are not clearly visible in this photo. Please upload a closer, well-lit smile photo facing the camera."],
  strengths = [], recommendations = [], costRangeINR = "", timeline = "",
  narrative = "Please share a clearer smile photo so we can give accurate suggestions."`;

const ALLOWED_SERVICE_CODES = new Set(['smile-designing', 'aligners-braces', 'dental-implants', 'general']);

function safeParseJson(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    // Strip ```json fences if Gemini wraps the JSON despite responseMimeType.
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) {
      try { return JSON.parse(fenced[1]); } catch { /* fall through */ }
    }
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      try { return JSON.parse(text.slice(firstBrace, lastBrace + 1)); } catch { /* ignore */ }
    }
    return null;
  }
}

function normalizeAnalysis(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const concerns = Array.isArray(raw.concerns) ? raw.concerns.filter((s) => typeof s === 'string').slice(0, 8) : [];
  const strengths = Array.isArray(raw.strengths) ? raw.strengths.filter((s) => typeof s === 'string').slice(0, 6) : [];
  const recommendations = Array.isArray(raw.recommendations)
    ? raw.recommendations
        .filter((r) => r && typeof r === 'object' && typeof r.treatment === 'string')
        .map((r) => ({
          treatment: String(r.treatment).slice(0, 120),
          service: ALLOWED_SERVICE_CODES.has(r.service) ? r.service : 'general',
          reason: typeof r.reason === 'string' ? r.reason.slice(0, 280) : ''
        }))
        .slice(0, 4)
    : [];
  return {
    concerns,
    strengths,
    recommendations,
    costRangeINR: typeof raw.costRangeINR === 'string' ? raw.costRangeINR.slice(0, 80) : '',
    timeline: typeof raw.timeline === 'string' ? raw.timeline.slice(0, 80) : '',
    narrative: typeof raw.narrative === 'string' ? raw.narrative.slice(0, 800) : ''
  };
}

async function analyzeSmileWithGemini({ imageBase64, mimeType }) {
  if (!GEMINI_API_KEY) return { ok: false, reason: 'missing_api_key' };
  if (!imageBase64) return { ok: false, reason: 'missing_image' };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  const body = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: SMILE_ANALYSIS_PROMPT },
          { inline_data: { mime_type: mimeType || 'image/jpeg', data: imageBase64 } }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.4,
      responseMimeType: 'application/json'
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }
    ]
  };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30_000);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    clearTimeout(timer);

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      const failure = parseGeminiFailure(response.status, errText);
      console.error('Gemini analysis error:', response.status, failure.detail || errText.slice(0, 300));
      return { ok: false, reason: failure.reason };
    }

    const json = await response.json();
    const text = json?.candidates?.[0]?.content?.parts?.find((p) => typeof p.text === 'string')?.text || '';
    const parsed = safeParseJson(text);
    const normalized = normalizeAnalysis(parsed);
    if (!normalized) return { ok: false, reason: 'bad_response' };
    return { ok: true, analysis: normalized };
  } catch (error) {
    console.error('Gemini call failed:', error?.message || error);
    return { ok: false, reason: 'request_failed' };
  }
}

function extractGeneratedImageDataUrl(json) {
  const parts = json?.candidates?.[0]?.content?.parts || [];
  for (const p of parts) {
    const inline = p.inlineData || p.inline_data;
    if (!inline?.data) continue;
    const mime = inline.mimeType || inline.mime_type || 'image/png';
    return `data:${mime};base64,${inline.data}`;
  }
  return null;
}

async function callGeminiImageModel(model, { imageBase64, mimeType }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  const body = {
    contents: [
      {
        role: 'user',
        parts: [
          { inline_data: { mime_type: mimeType || 'image/jpeg', data: imageBase64 } },
          { text: SMILE_IMAGE_PROMPT }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.35,
      responseModalities: ['TEXT', 'IMAGE']
    }
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90_000);
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: controller.signal
  });
  clearTimeout(timer);

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    const failure = parseGeminiFailure(response.status, errText);
    console.error('Gemini image error:', model, response.status, failure.detail || errText.slice(0, 500));
    return { ok: false, reason: failure.reason, detail: failure.detail };
  }

  const json = await response.json();
  const afterImage = extractGeneratedImageDataUrl(json);
  if (!afterImage) return { ok: false, reason: 'no_image_in_response' };
  return { ok: true, afterImage, model };
}

async function generateSmileAfterImage({ imageBase64, mimeType }) {
  if (!GEMINI_API_KEY) return { ok: false, reason: 'missing_api_key' };
  if (!imageBase64) return { ok: false, reason: 'missing_image' };

  const models = [GEMINI_IMAGE_MODEL, ...GEMINI_IMAGE_MODEL_FALLBACKS.filter((m) => m !== GEMINI_IMAGE_MODEL)];
  let lastReason = 'request_failed';
  let lastDetail = '';

  for (const model of models) {
    try {
      const result = await callGeminiImageModel(model, { imageBase64, mimeType });
      if (result.ok) {
        if (model !== GEMINI_IMAGE_MODEL) {
          console.log(`smile-preview: image OK via fallback model ${model}`);
        }
        return { ok: true, afterImage: result.afterImage };
      }
      lastReason = result.reason;
      lastDetail = result.detail || '';
      if (result.reason !== 'billing_required' && result.reason !== 'quota_exceeded' && !String(result.reason).includes('429')) {
        continue;
      }
      break;
    } catch (error) {
      console.error(`Gemini image failed (${model}):`, error?.message || error);
      lastReason = 'request_failed';
    }
  }

  return { ok: false, reason: lastReason, detail: lastDetail };
}

function fallbackAnalysis() {
  return {
    concerns: [],
    strengths: [],
    recommendations: [
      { treatment: 'Teeth Whitening', service: 'smile-designing', reason: 'Brightens the smile and freshens overall appearance.' },
      { treatment: 'Veneers / Smile Designing', service: 'smile-designing', reason: 'Refines tooth shape, gaps, and color for a balanced look.' },
      { treatment: 'Routine cleaning & checkup', service: 'general', reason: 'A baseline assessment helps choose the best next step.' }
    ],
    costRangeINR: '',
    timeline: '',
    narrative: 'AI analysis is unavailable right now, so here are general smile-design starting points. Book a free consultation for a personalized plan.'
  };
}

// ── AI Blog Generator ─────────────────────────────────────────────────────
app.post('/api/generate-blog', async (req, res) => {
  try {
    const { topic, tone, length } = req.body || {};
    if (!topic || !topic.trim()) return res.status(400).json({ error: 'Topic is required.' });
    if (!GEMINI_API_KEY) return res.status(503).json({ error: 'AI is not configured. Add GEMINI_API_KEY to .env.' });

    const wordCount = length === 'short' ? 300 : length === 'long' ? 1000 : 600;
    const toneDesc =
      tone === 'friendly'     ? 'friendly, warm, and conversational — like talking to a trusted friend' :
      tone === 'educational'  ? 'educational and informative — clear explanations, simple language' :
                                'professional and authoritative — confident, expert tone';

    const prompt = `You are a dental content writer for V Dental & Implant Center, a premium dental clinic in Indiranagar, Bangalore, India.

Write a complete, SEO-optimised blog post about: "${topic.trim()}"

Requirements:
- Tone: ${toneDesc}
- Target length: approximately ${wordCount} words
- Naturally mention "V Dental & Implant Center, Bangalore" once or twice
- Practical, useful content patients would value
- Do NOT include the blog title inside the content body

CONTENT FORMAT — use proper HTML tags only:
- Use <h2> for main section headings
- Use <h3> for sub-headings inside sections
- Use <p> for all paragraphs — wrap every paragraph in <p> tags
- Use <ul><li> for bullet point lists
- Use <ol><li> for numbered steps
- Use <strong> for important keywords
- Do NOT use markdown symbols (no **, no ##, no --)
- Do NOT include <html>, <head>, <body> tags — content body only
- Every section must be separated and clearly structured

Return ONLY a valid JSON object with this exact structure (no extra text outside the JSON):
{
  "title": "Compelling, SEO-friendly blog title",
  "excerpt": "1-2 sentence summary of the post (max 155 characters)",
  "content": "<h2>Section Heading</h2><p>Opening paragraph with context.</p><h3>Sub-heading</h3><p>Detailed content here.</p><ul><li>Point one</li><li>Point two</li></ul>",
  "metaTitle": "SEO meta title (max 60 characters)",
  "metaDescription": "SEO meta description (max 155 characters)",
  "metaKeywords": "keyword1, keyword2, keyword3, keyword4, keyword5"
}`;

    // Try primary model first, then fallback models if 503/429
    const blogModels = [
      GEMINI_MODEL,
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-2.0-flash',
    ].filter((m, i, arr) => arr.indexOf(m) === i); // dedupe

    const geminiBody = {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, responseMimeType: 'application/json' },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_HATE_SPEECH',        threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',  threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT',  threshold: 'BLOCK_ONLY_HIGH' }
      ]
    };

    let rawText = '';
    let lastError = 'request_failed';
    let succeeded = false;

    for (const model of blogModels) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 40_000);
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(geminiBody),
          signal: controller.signal
        });
        clearTimeout(timer);

        if (!response.ok) {
          const errText = await response.text().catch(() => '');
          const failure = parseGeminiFailure(response.status, errText);
          lastError = failure.reason;
          console.warn(`generate-blog: model ${model} returned ${response.status} (${failure.reason}), trying next...`);
          // Retry on 503 (overloaded) or 429 (quota), but not on 400/404 (bad key/model)
          if (response.status !== 503 && response.status !== 429) break;
          continue;
        }

        const json = await response.json();
        rawText = json?.candidates?.[0]?.content?.parts?.find(p => typeof p.text === 'string')?.text || '';
        if (rawText) { succeeded = true; console.log(`generate-blog: success via model ${model}`); break; }
      } catch (fetchErr) {
        lastError = 'request_failed';
        console.warn(`generate-blog: model ${model} fetch error:`, fetchErr?.message);
      }
    }

    if (!succeeded || !rawText) {
      return res.status(502).json({ error: `AI is currently busy. Please try again in a few seconds. (${lastError})` });
    }

    const parsed = safeParseJson(rawText);

    if (!parsed || !parsed.title || !parsed.content) {
      console.error('generate-blog: bad AI response', rawText.slice(0, 300));
      return res.status(502).json({ error: 'AI returned an unexpected response. Please try again.' });
    }

    return res.json({
      title:           parsed.title           || '',
      excerpt:         parsed.excerpt          || '',
      content:         parsed.content          || '',
      metaTitle:       parsed.metaTitle        || parsed.title || '',
      metaDescription: parsed.metaDescription  || parsed.excerpt || '',
      metaKeywords:    parsed.metaKeywords     || '',
    });
  } catch (err) {
    console.error('generate-blog error:', err?.message || err);
    return res.status(500).json({ error: 'Blog generation failed. Please try again.' });
  }
});

app.post('/api/smile-preview', async (req, res) => {
  try {
    const {
      image,
      originalImage,
      imageBase64: incomingBase64,
      mimeType: incomingMime,
      name,
      email,
      phone
    } = req.body || {};

    const patientName = String(name || '').trim();
    const patientEmail = String(email || '').trim().toLowerCase();
    const patientPhone = String(phone || '').trim();

    if (!patientName || !patientEmail || !patientPhone) {
      return res.status(400).json({ success: false, error: 'Name, email, and phone are required.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientEmail)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    let imageBase64 = incomingBase64 || null;
    let mimeType = incomingMime || null;

    // Accept data URLs from the legacy frontend ("data:image/jpeg;base64,...").
    if (!imageBase64 && typeof originalImage === 'string' && originalImage.startsWith('data:')) {
      const m = originalImage.match(/^data:([^;,]+);base64,(.+)$/);
      if (m) {
        mimeType = mimeType || m[1];
        imageBase64 = m[2];
      }
    }
    if (!imageBase64 && typeof image === 'string' && image.startsWith('data:')) {
      const m = image.match(/^data:([^;,]+);base64,(.+)$/);
      if (m) {
        mimeType = mimeType || m[1];
        imageBase64 = m[2];
      }
    }

    let analysis = null;
    let source = 'fallback';
    let reason = null;
    let afterImage = null;
    let imageSource = 'none';
    let imageReason = null;

    if (imageBase64) {
      const mime = mimeType || 'image/jpeg';
      const kb = Math.round((imageBase64.length * 3) / 4 / 1024);
      console.log(`smile-preview: image ~${kb}KB, imagePreview=${GEMINI_IMAGE_PREVIEW}`);

      const imagePromise = GEMINI_IMAGE_PREVIEW
        ? generateSmileAfterImage({ imageBase64, mimeType: mime })
        : Promise.resolve({ ok: false, reason: 'image_preview_disabled' });

      const [analysisResult, imageResult] = await Promise.all([
        analyzeSmileWithGemini({ imageBase64, mimeType: mime }),
        imagePromise
      ]);

      if (analysisResult.ok) {
        analysis = analysisResult.analysis;
        source = 'gemini';
      } else {
        reason = analysisResult.reason;
      }

      if (imageResult.ok) {
        afterImage = imageResult.afterImage;
        imageSource = 'gemini';
      } else {
        imageReason = imageResult.reason;
      }
    } else {
      reason = 'missing_image';
      imageReason = 'missing_image';
      return res.status(400).json({ success: false, error: 'Please upload a smile photo to continue.' });
    }

    if (!analysis) analysis = fallbackAnalysis();

    let submissionId = null;
    let saved = false;
    if (imageBase64) {
      try {
        const mime = mimeType || 'image/jpeg';
        const beforeImageUrl = writeBase64ImageToUploads(imageBase64, mime, 'before');
        const afterImageUrl = afterImage ? writeDataUrlImageToUploads(afterImage, 'after') : null;
        const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const insert = await dbRun(
          `INSERT INTO ai_previews (name, email, phone, beforeImageUrl, afterImageUrl, analysisJson, aiSource, status, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            patientName,
            patientEmail,
            patientPhone,
            beforeImageUrl,
            afterImageUrl,
            JSON.stringify(analysis),
            source,
            'new',
            createdAt
          ]
        );
        submissionId = insert.lastID;
        saved = true;

        try {
          await dbRun(
            `INSERT INTO leads (name, phone, email, source, service, message, status, createdAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              patientName,
              patientPhone,
              patientEmail,
              'ai-preview',
              'AI Smile Preview',
              'Patient submitted AI smile preview with before/after images.',
              'new',
              createdAt
            ]
          );
        } catch (leadErr) {
          console.warn('ai-preview lead insert:', leadErr.message);
        }
      } catch (saveErr) {
        console.error('ai-preview save error:', saveErr.message);
      }
    }

    return res.json({
      success: true,
      source,
      reason,
      imageSource,
      imageReason,
      saved,
      submissionId,
      message: source === 'gemini' ? 'Smile analyzed with Gemini AI' : 'Image processed (fallback recommendations)',
      afterImage,
      transformedImage: afterImage || image || null,
      analysis,
      recommendations: analysis.recommendations.map((r) => `${r.treatment}${r.reason ? ` — ${r.reason}` : ''}`)
    });
  } catch (error) {
    console.error('smile-preview error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================
// STEP 4: TREATMENT RECOMMENDATION API
// ============================================
app.post('/api/recommend-treatment', (req, res) => {
  const { answers } = req.body;
  let recommendedTreatment = 'General Checkup';

  if (answers) {
    if (answers.missingTeeth && answers.missingTeeth > 0) {
      recommendedTreatment = 'Dental Implants';
    } else if (answers.teeth === 'crooked') {
      recommendedTreatment = 'Aligners & Braces';
    } else if (answers.teeth === 'discolored') {
      recommendedTreatment = 'Teeth Whitening + Smile Designing';
    } else if (answers.smile === 'not-happy') {
      recommendedTreatment = 'Digital Smile Designing';
    }
  }

  const assessment = {
    id: assessments.length + 1,
    recommendedTreatment,
    details: answers,
    createdAt: new Date()
  };

  assessments.push(assessment);

  res.json({
    success: true,
    recommendedTreatment,
    estimatedCost: Math.floor(Math.random() * 5000) + 1000,
    timeframe: '3-6 months',
    assessmentId: assessment.id
  });
});

// ============================================
// STEP 5: APPOINTMENTS API
// ============================================
const AVAILABLE_SLOTS = [
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM'
];

app.post('/api/appointments', async (req, res) => {
  const { name, phone, email, service, issue } = req.body;
  const { date: normDate, time: normTime } = normalizeAppointmentSlot(req.body.date, req.body.time);

  if (!name || !phone || !normDate || !normTime) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

  let appointmentId;
  try {
    const result = await dbRun(
      `INSERT INTO appointments (name, phone, email, date, time, service, issue, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, phone, email || null, normDate, normTime, service || null, issue || null, 'pending', createdAt]
    );
    appointmentId = result.lastID;
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
      console.warn('Attempted to book an already taken slot:', normDate, normTime);
      return res.status(409).json({ success: false, error: 'This slot is no longer available. Please choose another time.' });
    }
    console.error('❌ Appointment insert error:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to save appointment' });
  }

  const appointment = {
    id: appointmentId,
    name,
    phone,
    email,
    date: normDate,
    time: normTime,
    service,
    issue,
    status: 'pending',
    createdAt: new Date()
  };

  const confirmationNumber = `APT-${Date.now()}`;

  // Store as a lead (persistent)
  let leadStatus = { saved: false, error: null };
  try {
    const result = await dbRun(
      `INSERT INTO leads (name, phone, email, source, service, message, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        phone,
        email || null,
        'booking',
        service || null,
        issue || null,
        'new',
        new Date().toISOString().slice(0, 19).replace('T', ' ')
      ]
    );
    leadStatus = { saved: true, leadId: result.lastID };
    console.log(`✅ Lead saved: id=${result.lastID} name=${name}`);
  } catch (error) {
    console.error('❌ Lead insert error:', error);
    leadStatus = { saved: false, error: error.message, code: error.code };
  }

  const emailStatus = await sendAppointmentConfirmationEmail({
    to: email,
    appointment,
    confirmationNumber
  });

  return res.json({
    success: true,
    message: 'Appointment booked successfully!',
    appointment,
    confirmationNumber,
    emailStatus,
    leadStatus
  });
});

app.get('/api/appointments', async (req, res) => {
  try {
    const appointments = await dbAll(`SELECT * FROM appointments ORDER BY createdAt DESC`);
    res.json({ success: true, appointments });
  } catch (error) {
    console.error('Appointments fetch error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch appointments' });
  }
});

app.get('/api/available-slots', (req, res) => {
  res.json({ success: true, slots: AVAILABLE_SLOTS });
});

/** Times already taken for a calendar date (YYYY-MM-DD) — drives booking UI slot disabling */
app.get('/api/booked-times', async (req, res) => {
  try {
    const normDate = normalizeAppointmentSlot(req.query.date || '', '').date;
    if (!normDate) return res.json({ success: true, bookedTimes: [] });

    const rows = await dbAll(`SELECT \`time\` FROM appointments WHERE \`date\` = ?`, [normDate]);
    const bookedTimes = rows.map((row) => normalizeAppointmentSlot('', row.time).time).filter(Boolean);

    res.json({ success: true, bookedTimes });
  } catch (error) {
    console.error('booked-times fetch error:', error.message);
    res.status(500).json({ success: false, bookedTimes: [], error: 'Failed to fetch booked times' });
  }
});

// ============================================
// STEP 6: GALLERY API
// ============================================
app.get('/api/gallery', (req, res) => {
  dbAll(`SELECT id, category, title, imageUrl, createdAt FROM gallery ORDER BY id DESC`)
    .then((rows) => {
      const gallery = rows.map((r) => ({
        id: r.id,
        category: r.category,
        title: r.title,
        image: r.imageUrl,
        createdAt: r.createdAt
      }));
      res.json({ success: true, gallery });
    })
    .catch((error) => {
      console.error('Gallery fetch error:', error);
      res.json({ success: true, gallery: [] });
    });
});

// ============================================
// ADMIN: LEADS API
// ============================================
app.post('/api/leads', async (req, res) => {
  const { name, phone, email, service, source, message } = req.body;
  
  if (!name || !phone) {
    return res.status(400).json({ success: false, error: 'Name and phone are required' });
  }

  try {
    const query = `
      INSERT INTO leads (name, phone, email, service, source, message, createdAt) 
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `;
    // Note: since this is MySQL, we should use NOW() instead of datetime('now')
    const mysqlQuery = `
      INSERT INTO leads (name, phone, email, service, source, message, createdAt) 
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    await dbRun(mysqlQuery, [name, phone, email || null, service || null, source || 'Website', message || null]);
    
    res.json({ success: true, message: 'Lead captured successfully!' });
  } catch (error) {
    console.error('Lead submission error:', error);
    res.status(500).json({ success: false, error: 'Failed to capture lead' });
  }
});

// Auto-capture every site visit as a lead (one per device/browser, deduped by sessionId).
app.post('/api/track-visit', async (req, res) => {
  const { path: landingPath, referrer, language, screen, sessionId } = req.body || {};

  const xff = (req.headers['x-forwarded-for'] || '').toString().split(',')[0].trim();
  const ip = xff || req.ip || req.socket?.remoteAddress || 'unknown';
  const userAgent = (req.headers['user-agent'] || 'unknown').slice(0, 500);

  try {
    if (sessionId) {
      const existingRows = await dbAll(
        `SELECT id, message FROM leads WHERE source = 'Website Visit'`
      );
      const sessionTag = `Session: ${sessionId}`;
      const existing = existingRows.find((r) => (r.message || '').includes(sessionTag));
      if (existing) {
        return res.json({ success: true, leadId: existing.id, deduped: true });
      }
    }

    const messageLines = [
      `IP: ${ip}`,
      `User-Agent: ${userAgent}`,
      `Landing page: ${landingPath || '/'}`,
      `Referrer: ${referrer || '(direct)'}`,
      `Language: ${language || 'unknown'}`,
      `Screen: ${screen || 'unknown'}`,
      sessionId ? `Session: ${sessionId}` : null
    ].filter(Boolean);

    const result = await dbRun(
      `INSERT INTO leads (name, phone, email, source, service, message, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        'Unique Visitor',
        ip,
        null,
        'Website Visit',
        null,
        messageLines.join('\n'),
        'new'
      ]
    );
    return res.json({ success: true, leadId: result.lastID, deduped: false });
  } catch (error) {
    console.error('Visit tracking error:', error);
    return res.status(500).json({ success: false, error: 'Failed to record visit' });
  }
});

app.get('/api/leads', requireAdmin, (req, res) => {
  dbAll(`SELECT * FROM leads ORDER BY createdAt DESC`)
    .then((rows) => res.json({ success: true, leads: rows }))
    .catch((error) => {
      console.error('Leads fetch error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch leads' });
    });
});

app.patch('/api/leads/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  if (!status) return res.status(400).json({ success: false, error: 'Missing status' });
  dbRun(`UPDATE leads SET status = ? WHERE id = ?`, [status, id])
    .then(() => res.json({ success: true }))
    .catch((error) => {
      console.error('Lead update error:', error);
      res.status(500).json({ success: false, error: 'Failed to update lead' });
    });
});

// ============================================
// ADMIN: GALLERY UPLOAD API
// ============================================
app.post(
  '/api/admin/gallery',
  requireAdmin,
  upload.single('image'),
  (req, res) => {
    const { category, title } = req.body || {};
    const imageFile = req.file;

    if (!category || !title || !imageFile) {
      if (imageFile?.path) fs.unlink(imageFile.path, () => { });
      return res.status(400).json({ success: false, error: 'Missing required fields/files' });
    }

    const imageUrl = `/uploads/${imageFile.filename}`;
    const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

    dbRun(
      `INSERT INTO gallery (category, title, imageUrl, createdAt) VALUES (?, ?, ?, ?)`,
      [category, title, imageUrl, createdAt]
    )
      .then(({ lastID }) => {
        res.json({
          success: true,
          item: { id: lastID, category, title, image: imageUrl, createdAt }
        });
      })
      .catch((error) => {
        console.error('Gallery insert error:', error);
        fs.unlink(imageFile.path, () => { });
        res.status(500).json({ success: false, error: 'Failed to save gallery item' });
      });
  }
);

app.delete('/api/admin/gallery/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const item = await dbGet(`SELECT imageUrl FROM gallery WHERE id = ?`, [id]);
    if (!item) return res.status(404).json({ success: false, error: 'Not found' });

    await dbRun(`DELETE FROM gallery WHERE id = ?`, [id]);

    const imgPath = path.join(uploadsDir, path.basename(item.imageUrl || ''));
    if (fs.existsSync(imgPath)) fs.unlink(imgPath, () => { });

    return res.json({ success: true });
  } catch (error) {
    console.error('Gallery delete error:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete gallery item' });
  }
});

// ============================================
// REVIEWS API
// ============================================

app.post('/api/reviews', async (req, res) => {
  const { name, email, phone, rating, comment } = req.body;
  if (!email || !phone || !rating) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

  try {
    await dbRun(
      `INSERT INTO reviews (name, email, phone, rating, comment, status, createdAt)
       VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
      [name || null, email, phone, rating, comment || null, createdAt]
    );
    res.json({ success: true, message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Review insert error:', error);
    res.status(500).json({ success: false, error: 'Failed to save review' });
  }
});

app.get('/api/reviews', async (req, res) => {
  try {
    // Only fetch published reviews for public view
    const reviews = await dbAll(`SELECT name, rating, comment, createdAt FROM reviews WHERE status = 'published' ORDER BY createdAt DESC`);
    res.json({ success: true, reviews });
  } catch (error) {
    console.error('Reviews fetch error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
  }
});

// Admin Review Routes
app.get('/api/admin/reviews', requireAdmin, async (req, res) => {
  try {
    const reviews = await dbAll(`SELECT * FROM reviews ORDER BY createdAt DESC`);
    res.json({ success: true, reviews });
  } catch (error) {
    console.error('Admin reviews fetch error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
  }
});

app.patch('/api/admin/reviews/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status || !['pending', 'published', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status' });
  }

  try {
    await dbRun(`UPDATE reviews SET status = ? WHERE id = ?`, [status, id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Review update error:', error);
    res.status(500).json({ success: false, error: 'Failed to update review' });
  }
});

app.delete('/api/admin/reviews/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await dbRun(`DELETE FROM reviews WHERE id = ?`, [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Review delete error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete review' });
  }
});

// ============================================
// BLOG API
// ============================================

function slugifyBlogTitle(title) {
  return String(title || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 200);
}

function estimateReadTime(html) {
  const text = String(html || '').replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.ceil(words / 200));
}

function mapBlogRow(row, { includeContent = true } = {}) {
  if (!row) return null;
  const post = {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt || '',
    category: row.category || 'General',
    author: row.author || 'V Dental and Implant Center',
    featuredImage: row.featuredImageUrl || null,
    metaTitle: row.metaTitle || row.title,
    metaDescription: row.metaDescription || row.excerpt || '',
    metaKeywords: row.metaKeywords || '',
    serviceLink: row.serviceLink || '',
    readTimeMinutes: row.readTimeMinutes || estimateReadTime(row.content),
    status: row.status || 'draft',
    createdAt: row.createdAt,
    publishedAt: row.publishedAt || row.createdAt,
  };
  if (includeContent) post.content = row.content || '';
  return post;
}

async function ensureUniqueBlogSlug(baseSlug, excludeId = null) {
  let slug = baseSlug || 'post';
  let n = 0;
  for (;;) {
    const candidate = n === 0 ? slug : `${slug}-${n}`;
    const existing = await dbAll(`SELECT id FROM blog_posts WHERE slug = ?`, [candidate]);
    if (!existing.length || (excludeId && existing.length === 1 && existing[0].id == excludeId)) {
      return candidate;
    }
    n += 1;
  }
}

async function seedBlogPostsIfEmpty() {
  try {
    const rows = await dbAll(`SELECT id FROM blog_posts LIMIT 1`);
    if (rows.length > 0) return;

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    for (const post of SEED_BLOG_POSTS) {
      await dbRun(
        `INSERT INTO blog_posts (
          title, slug, excerpt, content, category, author, featuredImageUrl,
          metaTitle, metaDescription, metaKeywords, serviceLink, readTimeMinutes,
          status, createdAt, publishedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          post.title,
          post.slug,
          post.excerpt,
          post.content,
          post.category,
          post.author,
          post.featuredImageUrl || null,
          post.metaTitle,
          post.metaDescription,
          post.metaKeywords,
          post.serviceLink,
          post.readTimeMinutes || estimateReadTime(post.content),
          'published',
          now,
          now,
        ]
      );
    }
    console.log(`✅ Seeded ${SEED_BLOG_POSTS.length} blog posts`);
  } catch (err) {
    console.warn('⚠️ Blog seed skipped:', err.message);
  }
}

app.get('/api/blog', async (req, res) => {
  try {
    const { category, limit } = req.query;
    let sql = `SELECT id, title, slug, excerpt, content, category, author, featuredImageUrl,
      metaTitle, metaDescription, metaKeywords, serviceLink, readTimeMinutes, status, createdAt, publishedAt
      FROM blog_posts WHERE status = 'published'`;
    const params = [];
    if (category) {
      sql += ` AND category = ?`;
      params.push(category);
    }
    sql += ` ORDER BY COALESCE(publishedAt, createdAt) DESC`;
    if (limit) {
      sql += ` LIMIT ?`;
      params.push(Math.min(Number(limit) || 10, 50));
    }
    const rows = await dbAll(sql, params);
    res.json({
      success: true,
      posts: rows.map((r) => mapBlogRow(r, { includeContent: false })),
    });
  } catch (error) {
    console.error('Blog list error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch blog posts' });
  }
});

app.get('/api/blog/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const rows = await dbAll(
      `SELECT * FROM blog_posts WHERE slug = ? AND status = 'published' LIMIT 1`,
      [slug]
    );
    const row = rows[0];
    if (!row) return res.status(404).json({ success: false, error: 'Post not found' });

    const related = await dbAll(
      `SELECT id, title, slug, excerpt, category, author, featuredImageUrl, readTimeMinutes, createdAt, publishedAt, content, status
       FROM blog_posts
       WHERE status = 'published' AND category = ? AND slug != ?
       ORDER BY COALESCE(publishedAt, createdAt) DESC LIMIT 3`,
      [row.category, slug]
    );

    res.json({
      success: true,
      post: mapBlogRow(row),
      related: related.map((r) => mapBlogRow(r, { includeContent: false })),
    });
  } catch (error) {
    console.error('Blog post error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch blog post' });
  }
});

app.get('/api/admin/blog', requireAdmin, async (req, res) => {
  try {
    const rows = await dbAll(`SELECT * FROM blog_posts ORDER BY createdAt DESC`);
    res.json({ success: true, posts: rows.map((r) => mapBlogRow(r)) });
  } catch (error) {
    console.error('Admin blog fetch error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch blog posts' });
  }
});

app.post('/api/admin/blog', requireAdmin, blogUploadOptional, async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      metaTitle,
      metaDescription,
      metaKeywords,
      serviceLink,
      readTimeMinutes,
      status,
    } = req.body || {};

    if (!title?.trim() || !content?.trim()) {
      if (req.file?.path) fs.unlink(req.file.path, () => {});
      return res.status(400).json({ success: false, error: 'Title and content are required' });
    }

    const baseSlug = slugifyBlogTitle(slug || title);
    const uniqueSlug = await ensureUniqueBlogSlug(baseSlug);
    const featuredImageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const postStatus = status === 'published' ? 'published' : 'draft';
    const publishedAt = postStatus === 'published' ? now : null;

    const { lastID } = await dbRun(
      `INSERT INTO blog_posts (
        title, slug, excerpt, content, category, author, featuredImageUrl,
        metaTitle, metaDescription, metaKeywords, serviceLink, readTimeMinutes,
        status, createdAt, publishedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        uniqueSlug,
        (excerpt || '').trim(),
        content,
        (category || 'General').trim(),
        (author || 'V Dental and Implant Center').trim(),
        featuredImageUrl,
        (metaTitle || title).trim(),
        (metaDescription || excerpt || '').trim(),
        (metaKeywords || '').trim(),
        (serviceLink || '').trim(),
        Number(readTimeMinutes) || estimateReadTime(content),
        postStatus,
        now,
        publishedAt,
      ]
    );

    const row = await dbGet(`SELECT * FROM blog_posts WHERE id = ?`, [lastID]);
    res.json({ success: true, post: mapBlogRow(row) });
  } catch (error) {
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    console.error('Blog create error:', error);
    res.status(500).json({ success: false, error: 'Failed to create blog post' });
  }
});

app.put('/api/admin/blog/:id', requireAdmin, blogUploadOptional, async (req, res) => {
  const { id } = req.params;
  try {
    const existing = await dbGet(`SELECT * FROM blog_posts WHERE id = ?`, [id]);
    if (!existing) {
      if (req.file?.path) fs.unlink(req.file.path, () => {});
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const {
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      metaTitle,
      metaDescription,
      metaKeywords,
      serviceLink,
      readTimeMinutes,
      status,
      removeFeaturedImage,
    } = req.body || {};

    if (!title?.trim() || !content?.trim()) {
      if (req.file?.path) fs.unlink(req.file.path, () => {});
      return res.status(400).json({ success: false, error: 'Title and content are required' });
    }

    const baseSlug = slugifyBlogTitle(slug || title);
    const uniqueSlug = await ensureUniqueBlogSlug(baseSlug, id);
    let featuredImageUrl = existing.featuredImageUrl;

    if (req.file) {
      if (existing.featuredImageUrl) {
        const oldPath = path.join(uploadsDir, path.basename(existing.featuredImageUrl));
        if (fs.existsSync(oldPath)) fs.unlink(oldPath, () => {});
      }
      featuredImageUrl = `/uploads/${req.file.filename}`;
    } else if (removeFeaturedImage === 'true' || removeFeaturedImage === true) {
      if (existing.featuredImageUrl) {
        const oldPath = path.join(uploadsDir, path.basename(existing.featuredImageUrl));
        if (fs.existsSync(oldPath)) fs.unlink(oldPath, () => {});
      }
      featuredImageUrl = null;
    }

    const postStatus = status === 'published' ? 'published' : 'draft';
    let publishedAt = existing.publishedAt;
    if (postStatus === 'published' && !publishedAt) {
      publishedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    await dbRun(
      `UPDATE blog_posts SET
        title = ?, slug = ?, excerpt = ?, content = ?, category = ?, author = ?,
        featuredImageUrl = ?, metaTitle = ?, metaDescription = ?, metaKeywords = ?,
        serviceLink = ?, readTimeMinutes = ?, status = ?, publishedAt = ?
       WHERE id = ?`,
      [
        title.trim(),
        uniqueSlug,
        (excerpt || '').trim(),
        content,
        (category || 'General').trim(),
        (author || 'V Dental and Implant Center').trim(),
        featuredImageUrl,
        (metaTitle || title).trim(),
        (metaDescription || excerpt || '').trim(),
        (metaKeywords || '').trim(),
        (serviceLink || '').trim(),
        Number(readTimeMinutes) || estimateReadTime(content),
        postStatus,
        publishedAt,
        id,
      ]
    );

    const row = await dbGet(`SELECT * FROM blog_posts WHERE id = ?`, [id]);
    res.json({ success: true, post: mapBlogRow(row) });
  } catch (error) {
    if (req.file?.path) fs.unlink(req.file.path, () => {});
    console.error('Blog update error:', error);
    res.status(500).json({ success: false, error: 'Failed to update blog post' });
  }
});

app.delete('/api/admin/blog/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const item = await dbGet(`SELECT featuredImageUrl FROM blog_posts WHERE id = ?`, [id]);
    if (!item) return res.status(404).json({ success: false, error: 'Post not found' });

    await dbRun(`DELETE FROM blog_posts WHERE id = ?`, [id]);

    if (item.featuredImageUrl) {
      const imgPath = path.join(uploadsDir, path.basename(item.featuredImageUrl));
      if (fs.existsSync(imgPath)) fs.unlink(imgPath, () => {});
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Blog delete error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete blog post' });
  }
});

// ============================================
// ADMIN: AI PREVIEW SUBMISSIONS
// ============================================
app.get('/api/admin/ai-previews', requireAdmin, async (req, res) => {
  try {
    const rows = await dbAll(`SELECT * FROM ai_previews ORDER BY createdAt DESC`);
    const previews = rows.map((row) => {
      let analysis = null;
      if (row.analysisJson) {
        try {
          analysis = JSON.parse(row.analysisJson);
        } catch {
          analysis = null;
        }
      }
      return { ...row, analysis };
    });
    res.json({ success: true, previews });
  } catch (error) {
    console.error('Admin ai-previews fetch error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch AI previews' });
  }
});

app.patch('/api/admin/ai-previews/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  if (!status || !['new', 'contacted', 'archived'].includes(status)) {
    return res.status(400).json({ success: false, error: 'Invalid status' });
  }
  try {
    await dbRun(`UPDATE ai_previews SET status = ? WHERE id = ?`, [status, id]);
    res.json({ success: true });
  } catch (error) {
    console.error('AI preview update error:', error);
    res.status(500).json({ success: false, error: 'Failed to update submission' });
  }
});

app.delete('/api/admin/ai-previews/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const row = await dbGet(`SELECT * FROM ai_previews WHERE id = ?`, [id]);
    await dbRun(`DELETE FROM ai_previews WHERE id = ?`, [id]);
    deleteAiPreviewFiles(row);
    res.json({ success: true });
  } catch (error) {
    console.error('AI preview delete error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete submission' });
  }
});

// ============================================
// STEP 8: CHATBOT API
// ============================================
const CLINIC = {
  brand: 'SmileVista Dental',
  whatsappNumber: '919037151894',
  email: 'care@vdentalandimplantcenter.com',
  bookingPath: '/booking',
  faqPath: '/faq',
  assessmentPath: '/assessment',
  aiPreviewPath: '/ai-preview',
  services: [
    { key: 'smile-designing', label: 'Digital Smile Designing', path: '/smile-designing' },
    { key: 'aligners-braces', label: 'Aligners & Braces', path: '/aligners-braces' },
    { key: 'dental-implants', label: 'Dental Implants', path: '/dental-implants' }
  ]
};

const CHATBOT_VERSION = '2026-05-08-faq-match-v2';

// Mirrors the 11 FAQs shown on the /faq page (see src/pages/FAQ.jsx and
// src/contexts/LanguageContext.jsx q1..q11 / a1..a11). Keep these in sync so
// the chatbot answers from the exact same content the user can read on the FAQ page.
const FAQS = [
  {
    id: 1,
    category: 'general',
    question: 'How long do treatments take?',
    answer:
      'Treatment duration varies by procedure. Smile designing: 1-2 weeks. Aligners: 6-18 months. Implants: 3-6 months. Schedule a consultation for personalized timelines.'
  },
  {
    id: 2,
    category: 'implants',
    question: 'Are dental implants safe?',
    answer:
      "Yes, implants are FDA-approved and have a 95%+ success rate. They're made from biocompatible titanium and are designed to last a lifetime with proper care."
  },
  {
    id: 3,
    category: 'aligners',
    question: 'Can I eat with aligners?',
    answer:
      'You should remove aligners before eating or drinking anything except water. This prevents staining and damage. Wear them 22 hours daily for best results.'
  },
  {
    id: 4,
    category: 'general',
    question: 'What is the cost of treatments?',
    answer:
      'Costs vary based on complexity. We offer flexible financing options. Schedule a free consultation to get a personalized quote for your specific needs.'
  },
  {
    id: 5,
    category: 'smile-designing',
    question: 'Is smile designing permanent?',
    answer:
      'Smile designs using veneers typically last 10-15 years. Bonding lasts 5-7 years. Regular maintenance and good oral hygiene extend longevity.'
  },
  {
    id: 6,
    category: 'general',
    question: 'Do you accept insurance?',
    answer:
      'Yes, we accept most dental insurance plans. Contact our team for details about your specific coverage and any pre-authorization requirements.'
  },
  {
    id: 7,
    category: 'implants',
    question: 'How long do dental implants last?',
    answer: 'With proper care, implants can last many years or even a lifetime.'
  },
  {
    id: 8,
    category: 'general',
    question: 'Is the procedure painful?',
    answer: 'The procedure is done under anesthesia and is generally comfortable.'
  },
  {
    id: 9,
    category: 'general',
    question: 'How long does treatment take?',
    answer: 'Most implant treatments are completed within 3-7 days depending on the case.'
  },
  {
    id: 10,
    category: 'general',
    question: 'Can I travel for treatment?',
    answer: 'Yes, we provide structured plans for outstation and international patients.'
  },
  {
    id: 11,
    category: 'general',
    question: 'Additional services?',
    answer: 'We also offer clear aligners and braces for patients looking to straighten their teeth.'
  }
];

function norm(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function includesAny(text, words) {
  return words.some((w) => text.includes(w));
}

// Words ignored during FAQ token scoring so they don't dominate weak matches.
const FAQ_STOPWORDS = new Set([
  'the','a','an','and','or','but','if','so','of','to','for','on','in','at','by','from','as',
  'is','are','was','were','be','been','being','am','do','does','did','have','has','had',
  'will','would','can','could','should','may','might','shall','must',
  'i','you','we','they','he','she','it','me','my','your','our','their','this','that','these','those',
  'there','here','what','how','when','where','why','which','who','whose','whom',
  'please','tell','told','say','said','let','about','any','some','all','too','very','just','also','than','then',
  'with','without','into','onto','over','under','out','off','up','down','again','more','most',
  'now','really','truly','actually','basically','still','yet','already','want','need','know','think'
]);

// Predicate / topic words get a higher weight so questions like
// "is X painful" prefer the "painful" FAQ over the "X" FAQ.
const FAQ_TOPIC_WEIGHTS = {
  cost: 3, costs: 3, price: 3, pricing: 3, fee: 3, fees: 3, charge: 3, charges: 3, expense: 3, quote: 2, estimate: 2,
  pain: 3, painful: 3, hurt: 3, hurts: 3, painless: 3, sore: 2, ache: 2,
  safe: 3, safety: 3, risk: 2, risks: 2, dangerous: 2,
  long: 2, duration: 2, lasts: 2, last: 2, permanent: 3, permanence: 3, lifetime: 2,
  insurance: 3, insurer: 3, coverage: 3, plan: 2, plans: 2,
  eat: 3, eating: 3, food: 2, drink: 2, drinking: 2, chew: 2, chewing: 2,
  travel: 3, travelling: 3, traveling: 3, outstation: 3, international: 3, abroad: 3, foreigner: 3, foreigners: 3, overseas: 3,
  longevity: 2, years: 1, anesthesia: 2, anaesthesia: 2, sedation: 2,
  additional: 2
};

// Lightweight synonym map - boosts FAQ matching without bringing in NLP deps.
const FAQ_SYNONYMS = {
  cost: ['price','pricing','fee','fees','charge','charges','expense','rate','quote','estimate','affordable','budget','costs'],
  costs: ['cost','price','pricing','fee','fees','charge'],
  price: ['cost','pricing','fee','fees','charge','quote','estimate','costs'],
  pricing: ['cost','price','fee','fees','costs'],
  fee: ['cost','price','pricing','charges','costs'],
  fees: ['cost','price','pricing','charges','costs'],
  pain: ['painful','hurt','hurts','sore','ache','aches','painless','discomfort'],
  painful: ['pain','hurt','hurts','sore','ache','painless'],
  painless: ['pain','painful','hurt'],
  hurt: ['pain','painful','sore'],
  long: ['duration','time','lasts','last','permanent','permanence','lifetime','longevity','long-term'],
  duration: ['time','long','lasts','last'],
  time: ['duration','long','lasts','last','timeline'],
  permanent: ['lasts','last','longevity','lifetime','years','forever','permanence'],
  longevity: ['permanent','lasts','last','lifetime','years','permanence','duration'],
  safe: ['safety','risk','risks','dangerous','side','effects','secure','reliable'],
  safety: ['safe','risk','risks','dangerous'],
  eat: ['eating','food','drink','drinking','meal','meals','chew','chewing','bite'],
  eating: ['eat','food','drink','drinking','chew'],
  food: ['eat','eating','drink','meals'],
  travel: ['travelling','traveling','outstation','international','abroad','foreign','foreigner','foreigners','overseas','tourist'],
  foreigner: ['travel','foreigners','international','outstation','abroad','overseas','tourist'],
  foreigners: ['travel','foreigner','international','outstation','abroad','overseas','tourist'],
  outstation: ['travel','international','foreigner','foreigners','abroad'],
  international: ['travel','foreigner','foreigners','outstation','abroad','overseas'],
  abroad: ['travel','international','foreigner','foreigners','overseas'],
  insurance: ['insurer','coverage','plan','plans','medical','health'],
  coverage: ['insurance','insurer','plan','plans'],
  aligner: ['aligners','invisalign','clear','transparent'],
  aligners: ['aligner','invisalign','clear','transparent'],
  invisalign: ['aligner','aligners'],
  brace: ['braces','orthodontic','orthodontics'],
  braces: ['brace','orthodontic','orthodontics','aligners'],
  implant: ['implants','tooth','teeth','replacement','missing','prosthetic','titanium'],
  implants: ['implant','tooth','teeth','replacement','missing','prosthetic','titanium'],
  tooth: ['teeth','missing'],
  teeth: ['tooth','missing'],
  missing: ['lost','gap','gaps','tooth','teeth','replacement'],
  designing: ['design','veneer','veneers','bonding','cosmetic','smile','makeover','aesthetic'],
  design: ['designing','veneer','veneers','bonding','cosmetic','smile'],
  veneer: ['veneers','design','designing','bonding','smile','cosmetic'],
  veneers: ['veneer','design','designing','bonding','smile','cosmetic'],
  bonding: ['veneer','veneers','design','designing','cosmetic'],
  cosmetic: ['design','designing','veneer','veneers','smile','aesthetic'],
  smile: ['designing','design','veneers','cosmetic','makeover'],
  procedure: ['treatment','treatments','procedures','surgery','operation','therapy'],
  procedures: ['procedure','treatment','treatments','surgery'],
  treatment: ['treatments','procedure','procedures','therapy','surgery'],
  treatments: ['treatment','procedure','procedures','therapy','services'],
  service: ['services','treatment','treatments','procedure','procedures','offer','offers'],
  services: ['service','treatment','treatments','procedure','procedures','offer','offers','additional'],
  offer: ['offers','provide','provides','services','service','additional'],
  offers: ['offer','provide','provides','services','service','additional'],
  provide: ['provides','offer','offers','services','service'],
  additional: ['extra','more','other','services','service','offer','offers'],
  anesthesia: ['anaesthesia','sedation','numb','numbing','painless'],
  doctor: ['dentist','consultant','specialist','clinician'],
  dentist: ['doctor','consultant','specialist'],
  consultation: ['consult','appointment','visit','checkup','book'],
  appointment: ['consultation','consult','visit','book','schedule','booking'],
  book: ['booking','appointment','schedule','consultation'],
  booking: ['book','appointment','schedule','consultation']
};

function tokenizeFaq(text) {
  return norm(text)
    .split(' ')
    .filter((tok) => tok.length >= 3 && !FAQ_STOPWORDS.has(tok));
}

function expandTokens(tokens) {
  const expanded = new Set();
  for (const tok of tokens) {
    expanded.add(tok);
    const syns = FAQ_SYNONYMS[tok];
    if (syns) {
      for (const syn of syns) expanded.add(syn);
    }
  }
  return expanded;
}

function bigrams(tokens) {
  const grams = [];
  for (let i = 0; i < tokens.length - 1; i++) {
    grams.push(`${tokens[i]} ${tokens[i + 1]}`);
  }
  return grams;
}

function bestFaqMatch(text) {
  const userText = norm(text);
  if (!userText) return null;

  const userTokens = tokenizeFaq(userText);
  if (userTokens.length === 0) return null;

  const expanded = expandTokens(userTokens);
  const userBigrams = bigrams(userTokens);

  let best = null;
  let bestScore = 0;

  for (const faq of FAQS) {
    const faqQ = norm(faq.question);
    const faqA = norm(faq.answer);
    const qTokens = new Set(tokenizeFaq(faqQ));
    const aTokens = new Set(tokenizeFaq(faqA));

    let score = 0;
    for (const tok of expanded) {
      const w = FAQ_TOPIC_WEIGHTS[tok] || 1;
      if (qTokens.has(tok)) {
        score += 4 * w;
      } else if (aTokens.has(tok)) {
        score += 1 * w;
      } else if (tok.length >= 4 && faqQ.includes(tok)) {
        // Substring fallback handles plural/singular variants (cost/costs).
        score += 2 * w;
      } else if (tok.length >= 4 && faqA.includes(tok)) {
        score += 1;
      }
    }

    // Bonus when entire user phrase / bigram appears in the question.
    if (userText.length >= 4 && faqQ.includes(userText)) score += 8;
    for (const bg of userBigrams) {
      if (faqQ.includes(bg)) score += 3;
      else if (faqA.includes(bg)) score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      best = faq;
    }
  }

  // Threshold of 5 ≈ at least one question token + a small supporting signal,
  // which keeps weak matches from masquerading as confident answers.
  return bestScore >= 5 ? best : null;
}

const QUESTION_LEAD_RE = /^(how|what|when|where|why|which|who|can|could|do|does|did|are|is|will|would|should|may|might|has|have|whats|hows)\b/i;

function looksLikeQuestion(rawText) {
  const trimmed = String(rawText || '').trim();
  if (!trimmed) return false;
  if (trimmed.includes('?')) return true;
  return QUESTION_LEAD_RE.test(trimmed);
}

function buildQuickReplies(intent) {
  switch (intent) {
    case 'services':
      return ['Smile designing details', 'Aligners & braces details', 'Dental implants details', 'Pricing', 'Book appointment'];
    case 'booking':
      return ['Available time slots', 'What should I bring?', 'Pricing', 'Emergency support'];
    case 'pricing':
      return ['Smile designing cost', 'Aligners cost', 'Implants cost', 'Book appointment'];
    case 'emergency':
      return ['Call/WhatsApp now', 'Book urgent appointment', 'Pain & swelling advice'];
    case 'assessment':
      return ['How does assessment work?', 'Is it accurate?', 'Book appointment'];
    default:
      return ['Treatments', 'Book appointment', 'Pricing', 'FAQ', 'Contact'];
  }
}

function faqReply(faq) {
  return { reply: `${faq.answer}\n\nMore: ${CLINIC.faqPath}`, intent: 'faq_match' };
}

function answerFor(text) {
  const t = norm(text);
  if (!t) {
    return {
      reply: "Please type a question like “treatments”, “booking”, “pricing”, or “implants”.",
      intent: 'default'
    };
  }

  if (/^(hi+|hello+|hey+|hola|namaste|good\s+(morning|afternoon|evening))\b/.test(t)) {
    return {
      reply: `Hello. I’m the ${CLINIC.brand} assistant. I can help with treatments, pricing guidance, and booking. What would you like to do?`,
      intent: 'greeting'
    };
  }

  // Operational intents always win - the user is asking us to *do* something,
  // not asking a content question.
  if (includesAny(t, ['time slot', 'time slots', 'available slots', 'available times', 'slots', 'timing', 'timings'])) {
    const slotList = AVAILABLE_SLOTS.map((s) => `- ${s}`).join('\n');
    return {
      reply:
        `Available time slots (today’s standard schedule):\n${slotList}\n\nTo pick one, open ${CLINIC.bookingPath} and select a date + slot.`,
      intent: 'booking'
    };
  }

  if (includesAny(t, ['book', 'booking', 'appointment', 'schedule'])) {
    return {
      reply:
        `To book, open ${CLINIC.bookingPath} and choose a service, date, and time slot.\n\nIf you prefer WhatsApp: wa.me/${CLINIC.whatsappNumber}`,
      intent: 'booking'
    };
  }

  if (includesAny(t, ['emergency', 'urgent', 'swelling', 'bleeding'])) {
    return {
      reply:
        `If this is severe pain, swelling, bleeding, fever, or trouble breathing/swallowing, seek urgent medical care.\n\nFor dental emergencies, message us on WhatsApp: wa.me/${CLINIC.whatsappNumber} (include your symptoms + photo if possible).`,
      intent: 'emergency'
    };
  }

  if (includesAny(t, ['assessment', 'quiz', 'recommend', 'recommendation', 'treatment recommendation'])) {
    return {
      reply:
        `You can take our quick assessment here: ${CLINIC.assessmentPath}. It suggests a likely treatment based on your answers.\n\nFor clinical accuracy, we confirm with an in-person exam.`,
      intent: 'assessment'
    };
  }

  if (includesAny(t, ['ai preview', 'smile preview'])) {
    return {
      reply:
        `Try the AI smile preview here: ${CLINIC.aiPreviewPath}. It’s a visual simulation (real outcomes can vary).`,
      intent: 'ai_preview'
    };
  }

  if (includesAny(t, ['contact', 'email', 'mail', 'whatsapp'])) {
    return {
      reply: `Contact us:\n- Email: ${CLINIC.email}\n- WhatsApp: wa.me/${CLINIC.whatsappNumber}`,
      intent: 'contact'
    };
  }

  if (includesAny(t, ['faq page', 'open faq', 'browse faq', 'all faqs', 'faq link'])) {
    return { reply: `You can browse FAQs here: ${CLINIC.faqPath}`, intent: 'faq' };
  }

  // For anything that looks like a real question, try to answer it directly
  // from the FAQ list (same content as the /faq page) using string matching.
  if (looksLikeQuestion(text)) {
    const faq = bestFaqMatch(t);
    if (faq) return faqReply(faq);
  }

  // Topic-level intents (only if FAQ didn't already win above).
  if (includesAny(t, ['treat', 'treatment', 'service', 'services', 'offer', 'do you do'])) {
    const serviceList = CLINIC.services.map((s) => `- ${s.label}: ${s.path}`).join('\n');
    return {
      reply: `We offer:\n${serviceList}`,
      intent: 'services'
    };
  }

  if (includesAny(t, ['smile designing', 'smile design', 'veneers', 'whitening', 'designing'])) {
    return {
      reply:
        `Digital Smile Designing focuses on aesthetics + bite harmony. Typical timeline is about 1–2 weeks depending on your case.\nLearn more: /smile-designing\n\nIf you want, share what you want to improve (shape, color, gaps, alignment).`,
      intent: 'service_smile_designing'
    };
  }

  if (includesAny(t, ['aligner', 'aligners', 'braces', 'invisalign', 'crooked'])) {
    return {
      reply:
        `Aligners & Braces straighten teeth gradually. Many aligner plans run ~6–18 months depending on complexity.\nLearn more: /aligners-braces\n\nDo you prefer clear aligners or braces?`,
      intent: 'service_aligners'
    };
  }

  if (includesAny(t, ['implant', 'implants', 'missing tooth', 'missing teeth'])) {
    return {
      reply:
        `Dental implants replace missing teeth with a long-term solution. Treatment often takes ~3–6 months (varies by healing/bone).\nLearn more: /dental-implants\n\nHow many teeth are you looking to replace?`,
      intent: 'service_implants'
    };
  }

  if (includesAny(t, ['price', 'pricing', 'cost', 'fees', 'how much'])) {
    return {
      reply:
        `Implant pricing depends on your clinical condition and treatment plan. Typical starting ranges are:\n\n• Single Implant: ₹25,000 – ₹50,000\n• Multiple Implants: Based on case\n• Full Mouth Implants: ₹2L – ₹5L\n• All-on-4 / All-on-6: Starting from ₹2.5L\n\nFinal cost depends on your clinical condition and treatment plan.`,
      intent: 'pricing'
    };
  }

  // Last resort: try FAQ matching one more time even for non-question phrasings
  // ("aligner pain", "implant cost"), then fall back to the default prompt.
  const fallbackFaq = bestFaqMatch(t);
  if (fallbackFaq) return faqReply(fallbackFaq);

  return {
    reply:
      `I can help with treatments, booking, pricing guidance, emergency steps, and FAQs.\nTry: “book appointment”, “aligners”, “implants”, “pricing”, or “contact”.`,
    intent: 'default'
  };
}

app.post('/api/chat', (req, res) => {
  const { message } = req.body || {};
  const { reply, intent } = answerFor(message);
  const quickReplies = buildQuickReplies(intent);

  const chat = { message, reply, intent, timestamp: new Date() };
  chatHistory.push(chat);

  res.json({ success: true, reply, quickReplies, intent, chatbotVersion: CHATBOT_VERSION });
});

// ============================================
// STEP 9: TRANSLATIONS API
// ============================================
app.get('/api/translations/:language', (req, res) => {
  const translations = {
    en: { services: 'Services', booking: 'Book Appointment', smile: 'Your Perfect Smile Awaits' },
    es: { services: 'Servicios', booking: 'Reservar Cita', smile: 'Tu Sonrisa Perfecta Te Espera' }
  };
  const lang = req.params.language || 'en';
  res.json({ success: true, translations: translations[lang] || translations.en });
});

// ============================================
// STEP 10: FAQ API
// ============================================
app.get('/api/faqs', (req, res) => {
  const faqs = [
    { id: 1, category: 'general', question: 'How long do treatments take?', answer: 'Treatment duration varies by procedure. Schedule a consultation for details.' },
    { id: 2, category: 'implants', question: 'Are dental implants safe?', answer: 'Yes, implants are FDA-approved and have a 95%+ success rate.' },
    { id: 3, category: 'aligners', question: 'Can I eat with aligners?', answer: 'Remove aligners before eating. Wear them 22 hours daily for best results.' },
    { id: 4, category: 'implants', question: 'How long do dental implants last?', answer: 'With proper care, implants can last many years or even a lifetime.' },
    { id: 5, category: 'general', question: 'Is the procedure painful?', answer: 'The procedure is done under anesthesia and is generally comfortable.' },
    { id: 6, category: 'general', question: 'How long does treatment take?', answer: 'Most implant treatments are completed within 3–7 days depending on the case.' },
    { id: 7, category: 'general', question: 'Can I travel for treatment?', answer: 'Yes, we provide structured plans for outstation and international patients.' }
  ];
  res.json({ success: true, faqs });
});

// ============================================
// STEP 11: REMINDER SYSTEM (Cron Job)
// ============================================
// Send reminder emails at 9 AM daily
cron.schedule('0 9 * * *', async () => {
  console.log('📧 Running appointment reminder job...');
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  try {
    const reminders = await dbAll(`SELECT * FROM appointments WHERE date = ? AND email IS NOT NULL AND email != ''`, [tomorrow]);
    console.log(`💬 Sending ${reminders.length} reminders for tomorrow (${tomorrow})...`);

    for (const apt of reminders) {
      await sendReminderEmail({ to: apt.email, appointment: apt });
    }
  } catch (err) {
    console.error('❌ Reminder job error:', err);
  }
});

// ============================================
// SERVE FRONTEND (React)
// ============================================
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

// API health check
app.get('/api/health', (req, res) => {
  res.json({
    message: 'SmileVista Dental API is running',
    version: '1.0.0',
    dbReady
  });
});

app.get('/api/gemini-status', async (req, res) => {
  const hasKey = Boolean(GEMINI_API_KEY);
  let textOk = false;
  let imageOk = false;
  let imageReason = null;
  let imageDetail = '';

  if (hasKey) {
    try {
      const textUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
      const tr = await fetch(textUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'Say OK' }] }] })
      });
      textOk = tr.ok;
    } catch {
      textOk = false;
    }

    try {
      const imageUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_IMAGE_MODEL)}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
      const ir = await fetch(imageUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'tiny white dot on gray background' }] }],
          generationConfig: { responseModalities: ['IMAGE'] }
        })
      });
      const body = await ir.text();
      imageOk = ir.ok && (body.includes('inlineData') || body.includes('inline_data'));
      if (!ir.ok) {
        const failure = parseGeminiFailure(ir.status, body);
        imageReason = failure.reason;
        imageDetail = (failure.detail || '').slice(0, 300);
      } else if (!imageOk) {
        imageReason = 'no_image_in_response';
      }
    } catch (e) {
      imageReason = 'request_failed';
      imageDetail = e?.message || '';
    }
  }

  res.json({
    hasApiKey: hasKey,
    imagePreviewEnabled: GEMINI_IMAGE_PREVIEW,
    imageModel: GEMINI_IMAGE_MODEL,
    textAnalysisOk: textOk,
    imageGenerationOk: imageOk,
    imageReason,
    imageDetail,
    billingLikelyRequired: imageReason === 'billing_required'
  });
});

// DB diagnostic endpoint - safe to remove after deployment is verified
app.get('/api/db-status', async (req, res) => {
  const env = {
    MYSQL_HOST: process.env.MYSQL_HOST || '(not set)',
    MYSQL_PORT: process.env.MYSQL_PORT || '(default 3306)',
    MYSQL_USER: process.env.MYSQL_USER || '(not set)',
    MYSQL_DATABASE: process.env.MYSQL_DATABASE || '(not set)',
    MYSQL_PASSWORD_SET: process.env.MYSQL_PASSWORD ? 'yes' : 'no'
  };

  try {
    const rows = await dbAll('SELECT COUNT(*) AS leadCount FROM leads');
    const recent = await dbAll(
      'SELECT id, name, phone, email, service, createdAt FROM leads ORDER BY id DESC LIMIT 5'
    );
    return res.json({
      success: true,
      connected: true,
      env,
      leadCount: rows[0]?.leadCount ?? 0,
      recentLeads: recent
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      connected: false,
      env,
      error: err.message,
      code: err.code,
      errno: err.errno
    });
  }
});

// Catch-all route to serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

async function startServer() {
  try {
    await initDb();
    await seedBlogPostsIfEmpty();
    dbReady = true;
    console.log('✅ Database initialized');
  } catch (err) {
    console.error('❌ Failed to initialize database:', err);
    process.exit(1);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log('✅ All APIs ready for V Dental and Implant Center');
  });
}

startServer();
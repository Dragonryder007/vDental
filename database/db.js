import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MOCK_DB_DIR = path.join(__dirname, 'mock_db');

dotenv.config();

const dbConfig = {
  host: process.env.MYSQL_HOST || '193.203.184.191',
  port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
  user: process.env.MYSQL_USER || 'u817245059_adminV',
  password: process.env.MYSQL_PASSWORD || 'Vdental1',
  database: process.env.MYSQL_DATABASE || 'u817245059_vdental'
};

let pool;
let useMockJson = false;

function getTableFromSql(sql) {
  const s = sql.toLowerCase();
  if (s.includes('leads')) return 'leads';
  if (s.includes('gallery')) return 'gallery';
  if (s.includes('appointments')) return 'appointments';
  if (s.includes('reviews')) return 'reviews';
  if (s.includes('ai_preview')) return 'ai_previews';
  if (s.includes('blog_post')) return 'blog_posts';
  return 'unknown';
}

function readMockJson(table) {
  if (!fs.existsSync(MOCK_DB_DIR)) fs.mkdirSync(MOCK_DB_DIR, { recursive: true });
  const filePath = path.join(MOCK_DB_DIR, `${table}.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) { return []; }
}

function writeMockJson(table, data) {
  const filePath = path.join(MOCK_DB_DIR, `${table}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/** Normalize booking slot strings so UNIQUE / duplicate checks stay consistent across clients */
export function normalizeAppointmentSlot(date, time) {
  const d = String(date ?? '').trim();
  const t = String(time ?? '')
    .trim()
    .replace(/\s+/g, ' ');
  return { date: d, time: t };
}

async function ensureAppointmentsSlotUnique(pool) {
  try {
    const [rows] = await pool.execute(
      `SELECT INDEX_NAME
       FROM information_schema.statistics
       WHERE table_schema = DATABASE() AND table_name = 'appointments' AND NON_UNIQUE = 0
       GROUP BY INDEX_NAME
       HAVING GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) IN ('date,time', 'time,date')`
    );
    if (rows.length > 0) return;
    await pool.execute(
      'ALTER TABLE appointments ADD UNIQUE KEY uniq_appt_date_time (`date`, `time`)'
    );
    console.log('✅ Added unique index uniq_appt_date_time on appointments (date, time)');
  } catch (e) {
    if (e.errno === 1062 || e.code === 'ER_DUP_ENTRY') {
      console.warn(
        '⚠️ appointments already has conflicting rows for the same date+time. Remove duplicates in MySQL, then redeploy — until then double-bookings are possible.'
      );
    } else if (e.errno === 1061) {
      // Duplicate key name
    } else {
      console.warn('⚠️ ensureAppointmentsSlotUnique:', e.message);
    }
  }
}

export async function initDb() {
  try {
    // On managed hosts like Hostinger the DB user cannot CREATE DATABASE.
    // Only try to auto-create the database when explicitly allowed (local dev).
    const allowCreate = String(process.env.MYSQL_ALLOW_CREATE_DB || '').toLowerCase() === 'true';

    if (allowCreate) {
      const connection = await mysql.createConnection({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: dbConfig.password
      });
      console.log(`Checking/Creating database: ${dbConfig.database}...`);
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
      await connection.end();
    } else {
      console.log(`Using existing database: ${dbConfig.database} (skip CREATE)`);
    }

    pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    console.log('✅ MySQL Pool Created');

    // 3. Create tables
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        source VARCHAR(50) NOT NULL,
        service VARCHAR(255),
        message TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'new',
        createdAt DATETIME NOT NULL
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        date VARCHAR(50) NOT NULL,
        time VARCHAR(50) NOT NULL,
        service VARCHAR(255),
        issue TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        createdAt DATETIME NOT NULL,
        UNIQUE (date, time)
      )
    `);
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS gallery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        imageUrl TEXT NOT NULL,
        createdAt DATETIME NOT NULL
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        rating INT NOT NULL,
        comment TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        createdAt DATETIME NOT NULL
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS ai_previews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        beforeImageUrl TEXT NOT NULL,
        afterImageUrl TEXT,
        analysisJson TEXT,
        aiSource VARCHAR(50),
        status VARCHAR(50) NOT NULL DEFAULT 'new',
        createdAt DATETIME NOT NULL
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        slug VARCHAR(500) NOT NULL,
        excerpt TEXT,
        content LONGTEXT NOT NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'General',
        author VARCHAR(255) NOT NULL DEFAULT 'V Dental and Implant Center',
        featuredImageUrl TEXT,
        metaTitle VARCHAR(500),
        metaDescription TEXT,
        metaKeywords VARCHAR(500),
        serviceLink VARCHAR(255),
        readTimeMinutes INT NOT NULL DEFAULT 5,
        status VARCHAR(50) NOT NULL DEFAULT 'draft',
        createdAt DATETIME NOT NULL,
        publishedAt DATETIME,
        UNIQUE KEY uniq_blog_slug (slug)
      )
    `);

    await ensureAppointmentsSlotUnique(pool);
    console.log('✅ Database Tables Verified');
    return pool;
  } catch (err) {
    // Only bypass if we are explicitly in a local dev environment without a DB
    if (process.env.NODE_ENV !== 'production' && (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND')) {
      console.warn(`⚠️ MySQL connection failed to ${dbConfig.host}. Bypassing with JSON mock database for local development.`);
      useMockJson = true;
      return null;
    }
    console.error('❌ CRITICAL: Database connection failed.');
    console.error('Error Code:', err.code);
    if (err.code === 'ER_BAD_DB_ERROR' || err.errno === 1049) {
      console.error(
        `Unknown database '${dbConfig.database}'. Fix: run CREATE DATABASE ${dbConfig.database}; in MySQL (same host as MYSQL_HOST), or set MYSQL_ALLOW_CREATE_DB=true in .env for local dev, or set MYSQL_DATABASE to a database that already exists.`
      );
    } else {
      console.error('Check your .env variables: MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE');
    }
    throw err;
  }
}

export const dbRun = async (sql, params = []) => {
  if (useMockJson) {
    const table = getTableFromSql(sql);
    const data = readMockJson(table);
    const sqlUpper = sql.trim().toUpperCase();

    if (sqlUpper.startsWith('INSERT')) {
      const newId = data.length > 0 ? Math.max(...data.map(i => i.id || 0)) + 1 : 1;
      const newItem = { id: newId, createdAt: new Date().toISOString() };
      
      // Map common table parameters for the app
      if (table === 'leads') [newItem.name, newItem.phone, newItem.email, newItem.source, newItem.service, newItem.message, newItem.status] = params;
      else if (table === 'appointments') {
        [newItem.name, newItem.phone, newItem.email, newItem.date, newItem.time, newItem.service, newItem.issue, newItem.status] = params;
        const { date: sd, time: st } = normalizeAppointmentSlot(newItem.date, newItem.time);
        newItem.date = sd;
        newItem.time = st;
        const taken = data.some((i) => {
          const cur = normalizeAppointmentSlot(i.date, i.time);
          return cur.date === sd && cur.time === st;
        });
        if (taken) {
          const dup = new Error('Duplicate appointment slot');
          dup.code = 'ER_DUP_ENTRY';
          dup.errno = 1062;
          throw dup;
        }
      }
      else if (table === 'gallery') [newItem.category, newItem.title, newItem.imageUrl] = params;
      else if (table === 'reviews') [newItem.name, newItem.email, newItem.phone, newItem.rating, newItem.comment, newItem.status] = params;
      else if (table === 'ai_previews') {
        [
          newItem.name,
          newItem.email,
          newItem.phone,
          newItem.beforeImageUrl,
          newItem.afterImageUrl,
          newItem.analysisJson,
          newItem.aiSource,
          newItem.status
        ] = params;
      }
      else if (table === 'blog_posts') {
        [
          newItem.title,
          newItem.slug,
          newItem.excerpt,
          newItem.content,
          newItem.category,
          newItem.author,
          newItem.featuredImageUrl,
          newItem.metaTitle,
          newItem.metaDescription,
          newItem.metaKeywords,
          newItem.serviceLink,
          newItem.readTimeMinutes,
          newItem.status,
          newItem.createdAt,
          newItem.publishedAt
        ] = params;
      }
      
      data.push(newItem);
      writeMockJson(table, data);
      return { lastID: newId, changes: 1 };
    }

    if (sqlUpper.startsWith('UPDATE')) {
      const id = params[params.length - 1];
      const idx = data.findIndex(i => i.id == id);
      if (idx !== -1) {
        if (table === 'blog_posts' && params.length >= 15) {
          [
            data[idx].title,
            data[idx].slug,
            data[idx].excerpt,
            data[idx].content,
            data[idx].category,
            data[idx].author,
            data[idx].featuredImageUrl,
            data[idx].metaTitle,
            data[idx].metaDescription,
            data[idx].metaKeywords,
            data[idx].serviceLink,
            data[idx].readTimeMinutes,
            data[idx].status,
            data[idx].publishedAt
          ] = params.slice(0, 14);
        } else {
          data[idx].status = params[0];
        }
        writeMockJson(table, data);
        return { changes: 1 };
      }
    }

    if (sqlUpper.startsWith('DELETE')) {
      const id = params[0];
      const filtered = data.filter(i => i.id != id);
      writeMockJson(table, filtered);
      return { changes: 1 };
    }
    return { lastID: 0, changes: 0 };
  }

  if (!pool) throw new Error('Database pool not initialized.');
  const [result] = await pool.execute(sql, params);
  return { lastID: result.insertId, changes: result.affectedRows };
};

export const dbAll = async (sql, params = []) => {
  if (useMockJson) {
    const table = getTableFromSql(sql);
    let data = readMockJson(table);
    const sqlLower = sql.toLowerCase();

    // Basic mock filtering for Reviews and Reminders
    if (sqlLower.includes("status = 'published'")) data = data.filter(i => i.status === 'published');
    if (sqlLower.includes('slug = ?')) data = data.filter(i => i.slug === params[0]);
    if (sqlLower.includes('category = ?')) data = data.filter(i => i.category === params[0]);
    if (sqlLower.includes('date = ?')) data = data.filter(i => i.date === params[0]);
    
    // Basic sorting by ID/Date
    if (sqlLower.includes('order by')) {
      data.sort((a, b) => (b.id || 0) - (a.id || 0));
    }
    
    return data;
  }

  if (!pool) throw new Error('Database pool not initialized.');
  const [rows] = await pool.execute(sql, params);
  return rows;
};

export const dbGet = async (sql, params = []) => {
  if (useMockJson) {
    const table = getTableFromSql(sql);
    const data = readMockJson(table);
    const id = params[0];
    return data.find(i => i.id == id) || null;
  }

  if (!pool) throw new Error('Database pool not initialized.');
  const [rows] = await pool.execute(sql, params);
  return rows[0] || null;
};

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const KNOWN_PATHS = [
  '/booking',
  '/faq',
  '/assessment',
  '/ai-preview',
  '/smile-designing',
  '/aligners-braces',
  '/dental-implants',
  '/results',
  '/reviews',
  '/'
];

// Splits a chat message into text + clickable link tokens.
// Recognises absolute URLs, wa.me/... numbers, and known internal paths like /faq.
function tokenizeMessage(text) {
  const pattern = /(https?:\/\/[^\s)]+|wa\.me\/[\w+]+|\/[a-z][a-z0-9-]*(?:\/[a-z0-9-]+)*)/gi;
  const tokens = [];
  let lastIndex = 0;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    const raw = match[0];
    if (raw.startsWith('http')) {
      tokens.push({ type: 'external', value: raw });
    } else if (raw.startsWith('wa.me/')) {
      tokens.push({ type: 'external', value: `https://${raw}` });
    } else if (KNOWN_PATHS.some((p) => raw === p || raw.startsWith(p + '/') || raw.startsWith(p + '?'))) {
      tokens.push({ type: 'internal', value: raw });
    } else {
      tokens.push({ type: 'text', value: raw });
    }
    lastIndex = match.index + raw.length;
  }
  if (lastIndex < text.length) tokens.push({ type: 'text', value: text.slice(lastIndex) });
  return tokens;
}

const Chatbot = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! I can help with booking, services, pricing, and FAQs. What do you need?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedReplies, setSuggestedReplies] = useState([
    'Book appointment',
    'Treatments',
    'Pricing',
    'FAQ',
    'Contact'
  ]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const params = new URLSearchParams(location.search || '');
    if (params.get('chat') === '1') {
      setIsOpen(true);
      params.delete('chat');
      const qs = params.toString();
      navigate({ pathname: location.pathname, search: qs ? `?${qs}` : '' }, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  const sendMessage = async (text) => {
    const msg = String(text || '').trim();
    if (!msg) return;

    setMessages((prev) => [...prev, { type: 'user', text: msg }]);
    setLoading(true);

    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:6000' : '';
    try {
      const response = await axios.post(`${API_BASE}/api/chat`, { message: msg });
      if (response?.data?.chatbotVersion) {
        // Helps confirm the backend is restarted and updated
        console.debug('chatbotVersion:', response.data.chatbotVersion);
      }
      const replyText = response?.data?.reply || 'Sorry, I could not generate a response.';
      setMessages((prev) => [...prev, { type: 'bot', text: replyText }]);
      if (Array.isArray(response?.data?.quickReplies) && response.data.quickReplies.length) {
        setSuggestedReplies(response.data.quickReplies.slice(0, 6));
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: 'bot', text: "Sorry, I couldn't process that. Please try again or contact our team." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const text = input;
    setInput('');
    await sendMessage(text);
  };

  const handleInternalLink = (e, path) => {
    e.preventDefault();
    setIsOpen(false);
    navigate(path);
  };

  const renderMessageContent = (text, isUser) => {
    if (isUser) return text;
    const origin = window.location.origin.replace(/\/$/, '');
    const tokens = tokenizeMessage(text);
    return tokens.map((tok, i) => {
      if (tok.type === 'text') return <span key={i}>{tok.value}</span>;
      if (tok.type === 'internal') {
        const display = `${origin}${tok.value}`;
        return (
          <a
            key={i}
            href={display}
            onClick={(e) => handleInternalLink(e, tok.value)}
            className="text-[color:var(--teal)] underline break-all hover:text-[color:var(--dk)]"
          >
            {display}
          </a>
        );
      }
      return (
        <a
          key={i}
          href={tok.value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[color:var(--teal)] underline break-all hover:text-[color:var(--dk)]"
        >
          {tok.value}
        </a>
      );
    });
  };

  const chatUi = (
    <>
      {isOpen && (
        <div
          className="chatbot-panel rounded-lg border border-black/10 bg-white text-xs font-sans shadow-xl"
          role="dialog"
          aria-modal="true"
          aria-label="Chat assistant"
        >
          {/* Header */}
          <div className="shrink-0 bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 px-2.5 py-2 text-white border-b border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <div className="flex min-w-0 flex-1 items-center gap-1.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-cyan-200" fill="currentColor" aria-hidden="true">
                    <path d="M12 2a1 1 0 0 1 1 1v1.06A7.002 7.002 0 0 1 19 11v5a4 4 0 0 1-4 4h-1v1a1 1 0 1 1-2 0v-1h-2v1a1 1 0 1 1-2 0v-1H7a4 4 0 0 1-4-4v-5a7.002 7.002 0 0 1 6-6.94V3a1 1 0 0 1 1-1h2ZM5 11v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-5a5 5 0 0 0-5-5h-2a5 5 0 0 0-5 5Zm4 1a1.25 1.25 0 1 1 0 2.5A1.25 1.25 0 0 1 9 12Zm6 0a1.25 1.25 0 1 1 0 2.5A1.25 1.25 0 0 1 15 12Z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold leading-tight">V Dental Assistant</h3>
                  <p className="hidden text-[9px] text-white/70 md:block leading-snug">Quick answers • booking • FAQs</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => sendMessage('Pricing')}
                  disabled={loading}
                  className="hidden rounded bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50 min-[340px]:inline-flex"
                >
                  Pricing
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded border border-white/10 bg-white/10 text-xs transition hover:bg-white/15"
                  aria-label="Close chat"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="min-h-0 flex-1 space-y-1.5 overflow-y-auto overscroll-contain bg-gradient-to-b from-white to-[color:var(--soft)]/40 px-2.5 py-1.5">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[90%] px-2.5 py-1 rounded-md text-[11px] leading-snug whitespace-pre-wrap break-words sm:max-w-[12rem] ${
                    msg.type === 'user'
                      ? 'bg-[color:var(--teal)] text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {renderMessageContent(msg.text, msg.type === 'user')}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-lg rounded-bl-none bg-gray-100 px-4 py-2">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500" style={{ animationDelay: '0.1s' }}></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {!loading && !input.trim() && suggestedReplies?.length ? (
            <div className="shrink-0 border-t border-gray-200 bg-white px-2.5 py-1">
              <p className="mb-1 text-[9px] text-gray-500">Suggested</p>
              <div className="grid grid-cols-2 gap-1">
                {suggestedReplies.slice(0, 4).map((reply, idx) => (
                  <button
                    key={`${reply}-${idx}`}
                    type="button"
                    onClick={() => sendMessage(reply)}
                    className="rounded-md border border-black/5 bg-[color:var(--soft)] px-1.5 py-1 text-left text-[10px] font-semibold text-[color:var(--dk)] transition hover:bg-white"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Input */}
          <form onSubmit={handleSendMessage} className="shrink-0 flex min-w-0 gap-1 border-t border-gray-200 p-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about booking, pricing…"
              className="min-w-0 flex-1 rounded border border-gray-300 px-2 py-1 text-[11px] focus:border-[color:var(--teal)] focus:outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="shrink-0 rounded bg-[color:var(--teal)] px-2 py-1 text-[11px] font-bold text-white transition hover:bg-[color:var(--dk)] disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-fab flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-2 text-white shadow-lg transition-all hover:scale-110 font-sans"
        title={isOpen ? 'Close assistant' : 'Open assistant'}
        aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
      >
        {isOpen ? (
          <span className="text-base leading-none">✕</span>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-cyan-200" fill="currentColor" aria-hidden="true">
            <path d="M12 2a1 1 0 0 1 1 1v1.06A7.002 7.002 0 0 1 19 11v5a4 4 0 0 1-4 4h-1v1a1 1 0 1 1-2 0v-1h-2v1a1 1 0 1 1-2 0v-1H7a4 4 0 0 1-4-4v-5a7.002 7.002 0 0 1 6-6.94V3a1 1 0 0 1 1-1h2ZM5 11v5a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-5a5 5 0 0 0-5-5h-2a5 5 0 0 0-5 5Zm4 1a1.25 1.25 0 1 1 0 2.5A1.25 1.25 0 0 1 9 12Zm6 0a1.25 1.25 0 1 1 0 2.5A1.25 1.25 0 0 1 15 12Z" />
          </svg>
        )}
      </button>
    </>
  );

  if (typeof document === 'undefined') return null;
  return createPortal(chatUi, document.body);
};

export default Chatbot;


import React from 'react';
import { Settings, Server, Key, Shield, Info } from 'lucide-react';

const providers = [
  { id: 'groq',    name: 'Groq',      model: 'Llama 3.3 70B Versatile', badge: 'Free Tier', color: 'var(--emerald-400)', glow: 'var(--emerald-glow)', border: 'rgba(16,185,129,0.2)' },
  { id: 'openai',  name: 'OpenAI',    model: 'GPT-4o Mini',              badge: 'Paid',      color: 'var(--sky-400)',     glow: 'var(--sky-glow)',     border: 'rgba(14,165,233,0.2)' },
  { id: 'gemini',  name: 'Gemini',    model: 'Gemini 1.5 Flash',         badge: 'Free Tier', color: 'var(--indigo-400)', glow: 'var(--indigo-glow)', border: 'rgba(99,102,241,0.2)' },
  { id: 'claude',  name: 'Claude',    model: 'Claude 3.5 Sonnet',        badge: 'Paid',      color: 'var(--amber-400)',  glow: 'var(--amber-glow)',  border: 'rgba(245,158,11,0.2)' },
  { id: 'offline', name: 'Offline',   model: 'Deterministic Rule Engine', badge: 'No API Key', color: 'var(--text-muted)', glow: 'rgba(255,255,255,0.04)', border: 'var(--border-default)' },
];

export default function SettingsPage({ provider, setProvider, customKey, setCustomKey }) {
  const selected = providers.find(p => p.id === provider) || providers[0];

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeUp">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Configure your AI engine, API keys, and preferences
          </p>
        </div>
      </div>

      {/* ── LLM Provider Selection ── */}
      <div className="card overflow-hidden">
        <div
          className="px-6 py-4 flex items-center gap-3"
          style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--indigo-glow)', border: '1px solid rgba(99,102,241,0.2)' }}
          >
            <Server className="w-4 h-4" style={{ color: 'var(--indigo-400)' }} />
          </div>
          <div>
            <h3 className="section-title">AI Engine Provider</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Select the LLM powering analysis and rewriting</p>
          </div>
        </div>

        <div className="p-6 space-y-3">
          {providers.map(p => {
            const isActive = provider === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setProvider(p.id)}
                className="w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all"
                style={{
                  background: isActive ? p.glow : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isActive ? p.border : 'var(--border-subtle)'}`,
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
              >
                {/* Radio dot */}
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    border: `2px solid ${isActive ? p.color : 'var(--border-default)'}`,
                    background: isActive ? p.color : 'transparent',
                    transition: 'all 0.15s',
                  }}
                >
                  {isActive && (
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--bg-surface)' }} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span style={{ fontSize: '14px', fontWeight: 600, color: isActive ? p.color : 'var(--text-primary)' }}>
                      {p.name}
                    </span>
                    <span
                      className="tag"
                      style={{
                        fontSize: '10px',
                        background: isActive ? p.glow : 'rgba(255,255,255,0.04)',
                        color: isActive ? p.color : 'var(--text-muted)',
                        border: `1px solid ${isActive ? p.border : 'var(--border-subtle)'}`,
                      }}
                    >
                      {p.badge}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {p.model}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── API Key ── */}
      {provider !== 'offline' && (
        <div className="card p-6 space-y-4 animate-fadeUp">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--amber-glow)', border: '1px solid rgba(245,158,11,0.2)' }}
            >
              <Key className="w-4 h-4" style={{ color: 'var(--amber-400)' }} />
            </div>
            <div>
              <h3 className="section-title">Custom API Key</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Override the server .env key with your own</p>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">
              {selected.name} API Key
            </label>
            <div style={{ position: 'relative' }}>
              <Key
                className="w-3.5 h-3.5"
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="password"
                value={customKey}
                onChange={e => setCustomKey(e.target.value)}
                placeholder={`Paste ${selected.name} key to override server config...`}
                className="input input-mono"
                style={{ paddingLeft: '34px' }}
              />
            </div>
          </div>

          <div
            className="flex items-start gap-2.5 rounded-lg p-3"
            style={{ background: 'var(--indigo-glow)', border: '1px solid rgba(99,102,241,0.15)' }}
          >
            <Shield className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: 'var(--indigo-400)' }} />
            <p style={{ fontSize: '12px', color: 'var(--indigo-400)', lineHeight: '1.55' }}>
              <strong>Zero-storage policy:</strong> Your API key is processed ephemerally in RAM per request and never written to any database or log file.
            </p>
          </div>
        </div>
      )}

      {/* ── Offline Mode Info ── */}
      {provider === 'offline' && (
        <div
          className="card p-6 flex items-start gap-3 animate-fadeUp"
          style={{ borderColor: 'var(--border-default)' }}
        >
          <Info className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Offline Rule Engine Active
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              The offline engine uses deterministic NLP rules and regex patterns to score resumes without any external API calls. No API key is required. Results may be less nuanced than LLM-powered analysis but are fully private and instant.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

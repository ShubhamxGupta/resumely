import React from 'react';
import { Settings, Server, Shield, Key, Database, Bell } from 'lucide-react';

export default function SettingsPage({ provider, setProvider, customKey, setCustomKey }) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          <span>System & LLM Gateway Settings</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">Configure AI engine models, API keys, and security preferences</p>
      </div>

      <div className="linear-card p-6 space-y-6">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
          <Server className="w-4 h-4 text-emerald-400" />
          <span>LLM Provider Configuration</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 font-mono mb-2">Selected LLM Provider</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full bg-[#090D16] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
            >
              <option value="groq">Groq (Llama 3.3 70B Versatile)</option>
              <option value="openai">OpenAI (GPT-4o Mini)</option>
              <option value="gemini">Google Gemini 1.5 Flash</option>
              <option value="claude">Anthropic Claude 3.5 Sonnet</option>
              <option value="offline">Offline Deterministic Rule Engine</option>
            </select>
          </div>

          {provider !== 'offline' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 font-mono mb-2">Custom Provider API Key</label>
              <input
                type="password"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                placeholder="Paste key to override server .env..."
                className="w-full bg-[#090D16] border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 font-mono"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Zero-Storage Policy: Custom keys are processed ephemerally in RAM and never written to DB logs.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

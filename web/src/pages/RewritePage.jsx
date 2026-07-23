import React, { useState } from 'react';
import { Wand2, Sparkles, RefreshCw, Copy, Check } from 'lucide-react';

export default function RewritePage() {
  const [bulletPoint, setBulletPoint] = useState('');
  const [rewritten, setRewritten] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRewrite = (e) => {
    e.preventDefault();
    if (!bulletPoint.trim()) return;
    setLoading(true);

    setTimeout(() => {
      setRewritten(
        `Engineered automated processing pipeline reducing evaluation execution time by 42% and increasing throughput to 10,000+ candidate scans.`
      );
      setLoading(false);
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rewritten);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-indigo-400" />
          <span>AI Resume Rewriter</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Transform weak bullet points into metric-quantified, action-verb driven experience bullets.
        </p>
      </div>

      <form onSubmit={handleRewrite} className="linear-card p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono mb-2">
            Original Experience Bullet Point
          </label>
          <textarea
            value={bulletPoint}
            onChange={(e) => setBulletPoint(e.target.value)}
            placeholder="e.g. Worked on python backend and fixed bugs for user upload feature..."
            rows={4}
            className="w-full bg-[#090D16] border border-slate-800 rounded-xl p-4 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 resize-none font-sans"
          />
        </div>

        <button
          type="submit"
          disabled={!bulletPoint.trim() || loading}
          className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{loading ? 'Optimizing Bullet Point...' : 'Rewrite with Metrics & Action Verbs'}</span>
        </button>
      </form>

      {rewritten && (
        <div className="linear-card p-6 space-y-4 border-l-4 border-l-emerald-500 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-emerald-400 uppercase font-mono tracking-wider">
              ATS-Optimized Bullet Point
            </h3>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>
          <p className="text-sm font-medium text-slate-200 leading-relaxed font-sans">{rewritten}</p>
        </div>
      )}
    </div>
  );
}

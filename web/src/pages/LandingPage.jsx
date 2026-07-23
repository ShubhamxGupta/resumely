import React from 'react';
import { ShieldCheck, Cpu, Layers, Sparkles, ArrowRight, UploadCloud } from 'lucide-react';

export default function LandingPage({ onStart }) {
  return (
    <div className="space-y-12 py-4 animate-fadeIn">
      {/* Hero Header Section */}
      <div className="surface-card p-10 text-center relative overflow-hidden border border-emerald-500/20 bg-gradient-to-b from-[#171f33] to-[#0f172a]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation ATS Optimization Engine</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight mb-3">
          Optimize Your Resume for Applicant Tracking Systems
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          Objective multi-dimensional ATS scoring, skill experience verification, and target keyword matching powered by local NLP and multi-provider AI adapters.
        </p>

        <button
          onClick={onStart}
          className="px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm inline-flex items-center gap-2 transition-all shadow-xl shadow-emerald-500/20 hover:scale-[1.02]"
        >
          <span>Start Analyzing Your Resume</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3 Pillar Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="surface-card p-6 space-y-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit border border-emerald-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-200">5-Dimensional ATS Scoring</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Evaluates Formatting (20%), Keywords (25%), Content Quality (25%), Skill Validation (15%), and ATS Reader Compatibility (15%).
          </p>
        </div>

        <div className="surface-card p-6 space-y-3">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-fit border border-blue-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-200">Skill Experience Verification</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Verifies whether claimed technical skills are backed up in project bullet points using 384-dimensional Sentence Transformer vector embeddings.
          </p>
        </div>

        <div className="surface-card p-6 space-y-3">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit border border-purple-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-200">Privacy & Zero-Storage</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Deterministic offline rule engine fallback works 100% locally. Custom third-party API keys are processed ephemerally in RAM and never saved to databases.
          </p>
        </div>
      </div>

      {/* How It Works Steps */}
      <div className="surface-card p-8 space-y-6">
        <h2 className="text-lg font-bold text-slate-200 text-center">How Resumely Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold flex items-center justify-center mx-auto text-sm">
              1
            </div>
            <h4 className="text-sm font-semibold text-slate-200">Upload Resume</h4>
            <p className="text-xs text-slate-400">PDF or DOCX documents up to 5MB.</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold flex items-center justify-center mx-auto text-sm">
              2
            </div>
            <h4 className="text-sm font-semibold text-slate-200">NLP & AI Engine Analysis</h4>
            <p className="text-xs text-slate-400">spaCy entity extraction and sentence vector matching.</p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-emerald-400 font-mono font-bold flex items-center justify-center mx-auto text-sm">
              3
            </div>
            <h4 className="text-sm font-semibold text-slate-200">Receive ATS PDF Report</h4>
            <p className="text-xs text-slate-400">Actionable recommendations and formal evaluation PDF.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

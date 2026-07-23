import React from 'react';
import { Eye, Clock, CheckCircle2, AlertCircle, ShieldAlert, ArrowUpRight } from 'lucide-react';

export default function RecruiterPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Eye className="w-5 h-5 text-sky-400" />
          <span>Recruiter 6-Second Simulation Mode</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Simulates initial recruiter visual gaze, scanning order, and instant shortlist/reject assessment.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="linear-card p-6 text-center space-y-2">
          <div className="text-3xl font-extrabold mono-val text-emerald-400">6.2s</div>
          <span className="text-xs text-slate-400 font-mono">Estimated Review Time</span>
        </div>

        <div className="linear-card p-6 text-center space-y-2">
          <div className="text-3xl font-extrabold mono-val text-sky-400">SHORTLIST</div>
          <span className="text-xs text-slate-400 font-mono">Initial Decision Tier</span>
        </div>

        <div className="linear-card p-6 text-center space-y-2">
          <div className="text-3xl font-extrabold mono-val text-indigo-400">92%</div>
          <span className="text-xs text-slate-400 font-mono">First-Impression Clarity</span>
        </div>
      </div>

      <div className="linear-card p-6 space-y-4">
        <h3 className="text-sm font-semibold text-slate-200">First-Gaze Heatmap Highlights</h3>
        <div className="space-y-3 text-xs text-slate-300">
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <span>Job Title Alignment: Senior Software Engineer</span>
            <span className="font-mono text-emerald-400 font-bold">Passed</span>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
            <span>Company Branding & Work History Hierarchy</span>
            <span className="font-mono text-emerald-400 font-bold">Passed</span>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <span>Education & Certification Placement</span>
            <span className="font-mono text-amber-400 font-bold">Noticeable</span>
          </div>
        </div>
      </div>
    </div>
  );
}

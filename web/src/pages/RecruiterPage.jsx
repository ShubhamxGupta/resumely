import React from 'react';
import { Eye, Timer, BarChart, CheckCircle2, AlertCircle, Info, ArrowUpRight } from 'lucide-react';

const checks = [
  { label: 'Job Title Alignment',                status: 'passed',  desc: 'Role title matches target position clearly' },
  { label: 'Company / Work History Hierarchy',   status: 'passed',  desc: 'Employer names are prominently displayed' },
  { label: 'Skills Section Visibility',          status: 'passed',  desc: 'Skills appear within first third of resume' },
  { label: 'Education & Certification Placement',status: 'warning', desc: 'Consider moving certifications higher if relevant' },
  { label: 'Quantified Achievements',            status: 'passed',  desc: 'Bullet points include measurable results' },
  { label: 'Visual Clutter Score',               status: 'passed',  desc: 'Resume has adequate whitespace and scannable sections' },
];

const statusConfig = {
  passed:  { label: 'Passed',  color: 'var(--emerald-400)', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.2)',  icon: CheckCircle2 },
  warning: { label: 'Review',  color: 'var(--amber-400)',   bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', icon: AlertCircle },
  failed:  { label: 'Failed',  color: 'var(--rose-400)',    bg: 'rgba(244,63,94,0.08)',  border: 'rgba(244,63,94,0.2)',  icon: AlertCircle },
};

export default function RecruiterPage() {
  const passed  = checks.filter(c => c.status === 'passed').length;
  const total   = checks.length;
  const pct     = Math.round((passed / total) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeUp">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Recruiter Simulation</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Simulates a recruiter's 6-second first-glance assessment of your resume
          </p>
        </div>
        <span className="tag tag-sky">
          <Eye className="w-3 h-3" />
          Demo Mode
        </span>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Timer,    value: '6.2s',     label: 'Avg Review Time',        color: 'var(--sky-400)',     glow: 'var(--sky-glow)',     border: 'rgba(14,165,233,0.2)' },
          { icon: Eye,      value: 'SHORTLIST', label: 'First Decision',         color: 'var(--emerald-400)', glow: 'var(--emerald-glow)', border: 'rgba(16,185,129,0.2)' },
          { icon: BarChart, value: `${pct}%`,  label: 'First-Impression Clarity', color: 'var(--indigo-400)', glow: 'var(--indigo-glow)',  border: 'rgba(99,102,241,0.2)' },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="card p-5 text-center animate-fadeUp"
              style={{ animationDelay: `${i * 0.08}s`, border: `1px solid ${m.border}` }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: m.glow, border: `1px solid ${m.border}` }}
              >
                <Icon className="w-4 h-4" style={{ color: m.color }} />
              </div>
              <p
                className="mono"
                style={{ fontSize: m.value.length > 4 ? '18px' : '24px', fontWeight: 800, color: m.color, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '6px' }}
              >
                {m.value}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.label}</p>
            </div>
          );
        })}
      </div>

      {/* ── Gaze Checklist ── */}
      <div className="card overflow-hidden">
        <div
          className="px-6 py-4 flex items-center gap-3"
          style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.02)' }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--sky-glow)', border: '1px solid rgba(14,165,233,0.2)' }}
          >
            <Eye className="w-4 h-4" style={{ color: 'var(--sky-400)' }} />
          </div>
          <div className="flex-1">
            <h3 className="section-title">First-Gaze Checklist</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Elements a recruiter notices in the first 6 seconds</p>
          </div>
          <div
            className="px-3 py-1.5 rounded-lg mono"
            style={{ background: 'var(--emerald-glow)', border: '1px solid rgba(16,185,129,0.2)', fontSize: '13px', fontWeight: 700, color: 'var(--emerald-400)' }}
          >
            {passed}/{total} passed
          </div>
        </div>

        <div className="divide-y">
          {checks.map((check, idx) => {
            const cfg = statusConfig[check.status];
            const Icon = cfg.icon;
            return (
              <div
                key={check.label}
                className="px-6 py-4 flex items-center gap-4 animate-fadeUp"
                style={{ borderTop: idx > 0 ? '1px solid var(--border-subtle)' : 'none', animationDelay: `${0.1 + idx * 0.05}s` }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                    {check.label}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{check.desc}</p>
                </div>
                <span
                  className="tag shrink-0"
                  style={{ fontSize: '11px', background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                >
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Info Note ── */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}
      >
        <Info className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Demo mode:</strong> This simulation is based on general recruiter behavior research. Upload your resume in the ATS Scorer tab to get a personalized analysis tailored to your actual document content.
        </p>
      </div>
    </div>
  );
}

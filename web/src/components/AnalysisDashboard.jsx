import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import {
  Award,
  AlertTriangle,
  Download,
  Target,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  ChevronRight
} from 'lucide-react';

/* ── Helpers ── */
const getScoreGrade = (score) => {
  if (score >= 85) return { label: 'Excellent', color: 'var(--emerald-400)', glow: 'var(--emerald-glow)', ring: '#10b981' };
  if (score >= 70) return { label: 'Good',      color: '#60a5fa',            glow: 'rgba(96,165,250,0.12)', ring: '#3b82f6' };
  if (score >= 55) return { label: 'Fair',       color: 'var(--amber-400)',   glow: 'var(--amber-glow)',   ring: '#f59e0b' };
  return             { label: 'Needs Work',  color: 'var(--rose-400)',    glow: 'var(--rose-glow)',    ring: '#f43f5e' };
};

/* Animated SVG score circle */
function ScoreRing({ score }) {
  const grade = getScoreGrade(score);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      {/* Track */}
      <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
      {/* Fill */}
      <circle
        cx="70" cy="70" r={radius}
        fill="none"
        stroke={grade.ring}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 70 70)"
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
      />
      {/* Score text */}
      <text x="70" y="65" textAnchor="middle" fill={grade.ring} fontSize="30" fontWeight="800" fontFamily="'JetBrains Mono', monospace">
        {score}
      </text>
      <text x="70" y="84" textAnchor="middle" fill="rgba(148,163,184,0.8)" fontSize="11" fontFamily="'Inter', sans-serif">
        out of 100
      </text>
    </svg>
  );
}

/* Custom bar tooltip */
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { name, value, max } = payload[0].payload;
  return (
    <div
      className="card"
      style={{ padding: '10px 14px', fontSize: '12px', minWidth: '140px', boxShadow: 'var(--shadow-md)' }}
    >
      <p style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>{name}</p>
      <p style={{ color: 'var(--text-primary)', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>
        {value} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>/ {max}</span>
      </p>
    </div>
  );
};

export default function AnalysisDashboard({ analysis, onDownloadPdf }) {
  if (!analysis) return null;

  const score       = Math.round(analysis.ats_score || analysis.ATS_score || 0);
  const grade       = getScoreGrade(score);
  const interpretation = analysis.interpretation || 'ATS Evaluation Complete';
  const componentScores = analysis.component_scores || {};
  const issues      = analysis.detailed_feedback || [];
  const jdComparison = analysis.jd_match_analysis || analysis.jd_comparison || null;

  const barData = [
    { name: 'Formatting',      value: componentScores.formatting    || 0, max: 20  },
    { name: 'Keywords',        value: componentScores.keywords       || 0, max: 25  },
    { name: 'Content',         value: componentScores.content        || 0, max: 25  },
    { name: 'Skill Valid.',    value: componentScores.skill_validation || 0, max: 15 },
    { name: 'ATS Reader',      value: componentScores.ats_compatibility || 0, max: 15 },
  ].map(d => ({ ...d, pct: Math.round((d.value / d.max) * 100) }));

  const highIssues  = issues.filter(i => i.severity_level === 'High');
  const otherIssues = issues.filter(i => i.severity_level !== 'High');

  return (
    <div className="space-y-6 animate-fadeUp">

      {/* ── 1. Hero Score + Component Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Score Card */}
        <div
          className="lg:col-span-2 card flex flex-col items-center justify-center text-center p-8 gap-4"
          style={{ border: `1px solid ${grade.ring}30` }}
        >
          <ScoreRing score={score} />
          <div>
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-2"
              style={{ background: grade.glow, border: `1px solid ${grade.ring}30` }}
            >
              <Award className="w-3.5 h-3.5" style={{ color: grade.color }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: grade.color }}>{grade.label}</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '200px', lineHeight: '1.5' }}>
              {interpretation}
            </p>
          </div>
        </div>

        {/* Component Bars */}
        <div className="lg:col-span-3 card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="section-title">Component Breakdown</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                5 evaluation dimensions
              </p>
            </div>
            <span className="tag tag-indigo">Normalized</span>
          </div>
          <div className="space-y-3">
            {barData.map((d, i) => (
              <div key={d.name} className="animate-fadeUp" style={{ animationDelay: `${0.1 + i * 0.06}s` }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {d.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="mono" style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 600 }}>
                      {d.value}
                    </span>
                    <span className="mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      / {d.max}
                    </span>
                  </div>
                </div>
                <div
                  className="rounded-full overflow-hidden"
                  style={{ height: '6px', background: 'rgba(255,255,255,0.06)' }}
                >
                  <div
                    className="rounded-full h-full"
                    style={{
                      width: `${d.pct}%`,
                      background: d.pct >= 80 ? 'var(--emerald-400)' : d.pct >= 60 ? 'var(--indigo-400)' : d.pct >= 40 ? 'var(--amber-400)' : 'var(--rose-400)',
                      transition: `width 0.8s ${0.2 + i * 0.07}s var(--ease-out)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. JD Match Analysis ── */}
      {jdComparison && (
        <div className="card p-6 animate-fadeUp" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center justify-between mb-5" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--sky-glow)', border: '1px solid rgba(14,165,233,0.2)' }}
              >
                <Target className="w-4 h-4" style={{ color: 'var(--sky-400)' }} />
              </div>
              <div>
                <h3 className="section-title">Job Description Match</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Keyword comparison analysis</p>
              </div>
            </div>
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: 'var(--sky-glow)', border: '1px solid rgba(14,165,233,0.2)' }}
            >
              <TrendingUp className="w-4 h-4" style={{ color: 'var(--sky-400)' }} />
              <span className="mono" style={{ fontSize: '20px', fontWeight: 800, color: 'var(--sky-400)' }}>
                {Math.round(jdComparison.match_percentage || 0)}%
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>match</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matched */}
            <div
              className="rounded-xl p-4"
              style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--emerald-400)' }} />
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--emerald-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Matched Keywords
                </span>
                <span className="tag tag-emerald" style={{ marginLeft: 'auto', fontSize: '10px' }}>
                  {jdComparison.matched_keywords?.length || 0}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(jdComparison.matched_keywords || []).map((kw, i) => (
                  <span
                    key={i}
                    className="tag"
                    style={{
                      background: 'rgba(16,185,129,0.1)',
                      color: 'var(--emerald-400)',
                      border: '1px solid rgba(16,185,129,0.2)',
                      fontSize: '11px',
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing */}
            <div
              className="rounded-xl p-4"
              style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.15)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-3.5 h-3.5" style={{ color: 'var(--amber-400)' }} />
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--amber-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Missing Keywords
                </span>
                <span className="tag tag-amber" style={{ marginLeft: 'auto', fontSize: '10px' }}>
                  {jdComparison.missing_keywords?.length || 0}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(jdComparison.missing_keywords || []).map((kw, i) => (
                  <span
                    key={i}
                    className="tag"
                    style={{
                      background: 'rgba(245,158,11,0.1)',
                      color: 'var(--amber-400)',
                      border: '1px solid rgba(245,158,11,0.2)',
                      fontSize: '11px',
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. Recommendations ── */}
      {issues.length > 0 && (
        <div className="card animate-fadeUp" style={{ animationDelay: '0.2s' }}>
          {/* Card Header */}
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--indigo-glow)', border: '1px solid rgba(99,102,241,0.2)' }}
              >
                <Sparkles className="w-4 h-4" style={{ color: 'var(--indigo-400)' }} />
              </div>
              <div>
                <h3 className="section-title">Actionable Recommendations</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Sorted by impact — address high severity items first
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {highIssues.length > 0 && (
                <span className="tag tag-rose">{highIssues.length} High</span>
              )}
              {otherIssues.length > 0 && (
                <span className="tag tag-amber">{otherIssues.length} Med</span>
              )}
            </div>
          </div>

          {/* Issues List */}
          <div className="divide-y" style={{ '--tw-divide-opacity': 1 }}>
            {[...highIssues, ...otherIssues].map((issue, idx) => {
              const isHigh = issue.severity_level === 'High';
              return (
                <div
                  key={idx}
                  className="px-6 py-4 animate-fadeUp"
                  style={{ animationDelay: `${0.25 + idx * 0.04}s`, borderTop: idx > 0 ? '1px solid var(--border-subtle)' : 'none' }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center mt-0.5 shrink-0"
                      style={{
                        background: isHigh ? 'var(--rose-glow)' : 'var(--amber-glow)',
                        border: `1px solid ${isHigh ? 'rgba(244,63,94,0.2)' : 'rgba(245,158,11,0.2)'}`,
                      }}
                    >
                      <AlertTriangle
                        className="w-3.5 h-3.5"
                        style={{ color: isHigh ? 'var(--rose-400)' : 'var(--amber-400)' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {issue.issue_title}
                        </h4>
                        <span
                          className="tag"
                          style={{
                            fontSize: '10px',
                            background: isHigh ? 'var(--rose-glow)' : 'var(--amber-glow)',
                            color: isHigh ? 'var(--rose-400)' : 'var(--amber-400)',
                            border: `1px solid ${isHigh ? 'rgba(244,63,94,0.2)' : 'rgba(245,158,11,0.2)'}`,
                          }}
                        >
                          {issue.severity_level}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        {issue.explanation}
                      </p>
                      {issue.how_to_fix && (
                        <div
                          className="mt-3 rounded-lg p-3 flex items-start gap-2"
                          style={{
                            background: 'rgba(16,185,129,0.05)',
                            border: '1px solid rgba(16,185,129,0.12)',
                          }}
                        >
                          <ChevronRight className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: 'var(--emerald-400)' }} />
                          <div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--emerald-400)', display: 'block', marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              How to fix
                            </span>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
                              {issue.how_to_fix}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 4. Export CTA ── */}
      <div
        className="card-highlight flex flex-col sm:flex-row items-center justify-between gap-4 p-6 animate-fadeUp"
        style={{ animationDelay: '0.3s' }}
      >
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Export Full ATS Report
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Download a formatted PDF with all findings, scores, and recommendations
          </p>
        </div>
        <button
          onClick={onDownloadPdf}
          className="btn btn-primary shrink-0"
          style={{ minWidth: '190px' }}
        >
          <Download className="w-4 h-4" />
          <span>Download PDF Report</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
        </button>
      </div>
    </div>
  );
}

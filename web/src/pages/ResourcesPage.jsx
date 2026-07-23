import React from 'react';
import { BookOpen, CheckCircle, XCircle, Code, Briefcase, Palette, LightbulbIcon } from 'lucide-react';

const dos = [
  'Use standard section headers: EXPERIENCE, EDUCATION, TECHNICAL SKILLS, CERTIFICATIONS.',
  'Explicitly list every technology and framework mentioned in the target job description.',
  'Quantify achievement bullets with metrics — percentages, dollar values, user counts.',
  'Use standard professional typography: Arial, Calibri, Inter, or Times New Roman.',
  'Export as a single-column, clean PDF or DOCX with no embedded graphics.',
  'Include both the spelled-out acronym and the abbreviation (e.g. "Machine Learning (ML)").',
];

const donts = [
  'Avoid complex tables, multi-column CSS grids, and floating text boxes.',
  'Do not put critical contact details inside PDF headers or footers — parsers skip them.',
  'Avoid embedded images, chart graphics, or skill-rating circles.',
  'Never use hidden white-text keyword stuffing — modern ATS systems flag it.',
  'Avoid special characters in section headers (e.g. ★ Skills or → Experience).',
];

const industries = [
  {
    label: 'Software Engineering',
    icon: Code,
    color: 'var(--indigo-400)',
    glow: 'var(--indigo-glow)',
    border: 'rgba(99,102,241,0.2)',
    keywords: ['Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Docker', 'Kubernetes', 'CI/CD', 'Microservices', 'REST APIs', 'PostgreSQL', 'GraphQL', 'AWS', 'GCP'],
  },
  {
    label: 'Business & Management',
    icon: Briefcase,
    color: 'var(--emerald-400)',
    glow: 'var(--emerald-glow)',
    border: 'rgba(16,185,129,0.2)',
    keywords: ['Project Management', 'Cross-functional Leadership', 'Stakeholder Alignment', 'P&L Ownership', 'Strategic Planning', 'Agile', 'Scrum', 'OKRs', 'KPI Tracking', 'Roadmapping'],
  },
  {
    label: 'UI/UX & Product Design',
    icon: Palette,
    color: 'var(--amber-400)',
    glow: 'var(--amber-glow)',
    border: 'rgba(245,158,11,0.2)',
    keywords: ['Figma', 'Wireframing', 'User Research', 'Design Systems', 'Prototyping', 'Usability Testing', 'Visual Hierarchy', 'Accessibility (WCAG)', 'Information Architecture', 'A/B Testing'],
  },
];

export default function ResourcesPage() {
  return (
    <div className="space-y-8 animate-fadeUp">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">ATS Guidelines</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Industry best practices and formatting rules for Applicant Tracking Systems
          </p>
        </div>
        <span className="tag tag-emerald">
          <LightbulbIcon className="w-3 h-3" />
          Evidence-based
        </span>
      </div>

      {/* ── Do's and Don'ts ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Do's */}
        <div
          className="card p-6"
          style={{ borderTop: '3px solid var(--emerald-400)' }}
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--emerald-glow)', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              <CheckCircle className="w-4 h-4" style={{ color: 'var(--emerald-400)' }} />
            </div>
            <div>
              <h3 className="section-title">Best Practices</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>What ATS systems reward</p>
            </div>
          </div>
          <ul className="space-y-3">
            {dos.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 animate-fadeUp"
                style={{ animationDelay: `${0.05 + i * 0.04}s` }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'var(--emerald-glow)', border: '1px solid rgba(16,185,129,0.2)' }}
                >
                  <CheckCircle className="w-2.5 h-2.5" style={{ color: 'var(--emerald-400)' }} />
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.55' }}>{item}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Don'ts */}
        <div
          className="card p-6"
          style={{ borderTop: '3px solid var(--rose-400)' }}
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--rose-glow)', border: '1px solid rgba(244,63,94,0.2)' }}
            >
              <XCircle className="w-4 h-4" style={{ color: 'var(--rose-400)' }} />
            </div>
            <div>
              <h3 className="section-title">Critical Pitfalls</h3>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>What causes ATS rejection</p>
            </div>
          </div>
          <ul className="space-y-3">
            {donts.map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-3 animate-fadeUp"
                style={{ animationDelay: `${0.05 + i * 0.04}s` }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'var(--rose-glow)', border: '1px solid rgba(244,63,94,0.2)' }}
                >
                  <XCircle className="w-2.5 h-2.5" style={{ color: 'var(--rose-400)' }} />
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.55' }}>{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Industry Keywords ── */}
      <div className="card p-6">
        <div className="mb-6">
          <h3 className="section-title mb-1">High-Impact Industry Keywords</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Keywords most frequently scanned by ATS systems per industry vertical
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {industries.map((ind, idx) => {
            const Icon = ind.icon;
            return (
              <div
                key={ind.label}
                className="rounded-xl p-5 animate-fadeUp"
                style={{
                  animationDelay: `${0.1 + idx * 0.07}s`,
                  background: 'rgba(255,255,255,0.02)',
                  border: `1px solid ${ind.border}`,
                }}
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: ind.glow, border: `1px solid ${ind.border}` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: ind.color }} />
                  </div>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {ind.label}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {ind.keywords.map(kw => (
                    <span
                      key={kw}
                      className="tag"
                      style={{
                        fontSize: '11px',
                        background: ind.glow,
                        color: ind.color,
                        border: `1px solid ${ind.border}`,
                      }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── ATS Score Ranges ── */}
      <div className="card p-6">
        <h3 className="section-title mb-5">Understanding ATS Score Ranges</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { range: '85–100', label: 'Excellent',  desc: 'Strong candidate, likely shortlisted',     color: 'var(--emerald-400)', bg: 'rgba(16,185,129,0.08)',   border: 'rgba(16,185,129,0.2)' },
            { range: '70–84',  label: 'Good',        desc: 'Competitive, may reach screening round', color: '#60a5fa',            bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.2)' },
            { range: '55–69',  label: 'Fair',         desc: 'Improvements recommended before applying', color: 'var(--amber-400)', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
            { range: '0–54',   label: 'Needs Work',  desc: 'Likely filtered before human review',   color: 'var(--rose-400)',    bg: 'rgba(244,63,94,0.08)',  border: 'rgba(244,63,94,0.2)' },
          ].map((tier, i) => (
            <div
              key={tier.range}
              className="rounded-xl p-4 text-center animate-fadeUp"
              style={{ animationDelay: `${0.1 + i * 0.06}s`, background: tier.bg, border: `1px solid ${tier.border}` }}
            >
              <p className="mono" style={{ fontSize: '20px', fontWeight: 800, color: tier.color, marginBottom: '4px' }}>
                {tier.range}
              </p>
              <p style={{ fontSize: '12px', fontWeight: 700, color: tier.color, marginBottom: '6px' }}>
                {tier.label}
              </p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.45' }}>
                {tier.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

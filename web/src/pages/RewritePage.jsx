import React, { useState } from 'react';
import { Wand2, Sparkles, Loader2, Copy, Check, FileText, Send, ArrowRight } from 'lucide-react';
import { rewriteBullet, generateCoverLetter } from '../services/api';

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 16px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: active ? 600 : 400,
        background: active ? 'var(--indigo-glow)' : 'transparent',
        color: active ? 'var(--indigo-400)' : 'var(--text-muted)',
        border: active ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
        cursor: 'pointer',
        transition: 'all 0.15s var(--ease-out)',
      }}
    >
      {children}
    </button>
  );
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handle}
      className="btn btn-ghost"
      style={{ padding: '6px 12px', fontSize: '12px' }}
    >
      {copied
        ? <><Check className="w-3.5 h-3.5" style={{ color: 'var(--emerald-400)' }} /><span style={{ color: 'var(--emerald-400)' }}>Copied</span></>
        : <><Copy className="w-3.5 h-3.5" /><span>Copy</span></>
      }
    </button>
  );
}

export default function RewritePage({ provider, customKey, token }) {
  const [activeTab, setActiveTab] = useState('bullet');

  // Bullet
  const [bulletPoint, setBulletPoint]   = useState('');
  const [jobTitle, setJobTitle]         = useState('');
  const [rewritten, setRewritten]       = useState('');
  const [bulletLoading, setBulletLoading] = useState(false);

  // Cover Letter
  const [clJobTitle, setClJobTitle] = useState('');
  const [clCompany, setClCompany]   = useState('');
  const [clSkills, setClSkills]     = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [clLoading, setClLoading]   = useState(false);

  const handleRewrite = async (e) => {
    e.preventDefault();
    if (!bulletPoint.trim()) return;
    setBulletLoading(true);
    try {
      const res = await rewriteBullet({ bulletPoint, jobTitle, provider, customKey, token });
      setRewritten(res.rewritten_bullet || '');
    } catch (err) {
      console.error(err);
    } finally {
      setBulletLoading(false);
    }
  };

  const handleGenerateCoverLetter = async (e) => {
    e.preventDefault();
    if (!clJobTitle.trim() || !clCompany.trim()) return;
    setClLoading(true);
    try {
      const res = await generateCoverLetter({ jobTitle: clJobTitle, companyName: clCompany, skillsSummary: clSkills, provider, customKey, token });
      setCoverLetter(res.cover_letter || '');
    } catch (err) {
      console.error(err);
    } finally {
      setClLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeUp">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Writing Suite</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Generate metric-driven bullet points and tailored cover letters with your selected AI provider
          </p>
        </div>
        {/* Tab Switcher */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
        >
          <TabButton active={activeTab === 'bullet'} onClick={() => setActiveTab('bullet')}>
            Bullet Rewriter
          </TabButton>
          <TabButton active={activeTab === 'cover_letter'} onClick={() => setActiveTab('cover_letter')}>
            Cover Letter
          </TabButton>
        </div>
      </div>

      {/* ── Tab: Bullet Rewriter ── */}
      {activeTab === 'bullet' && (
        <div className="space-y-5 animate-fadeUp">
          {/* Info Banner */}
          <div
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ background: 'var(--indigo-glow)', border: '1px solid rgba(99,102,241,0.2)' }}
          >
            <Wand2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--indigo-400)' }} />
            <p style={{ fontSize: '13px', color: 'var(--indigo-400)', lineHeight: '1.5' }}>
              Transform vague experience bullets into quantified, action-verb-led statements that pass ATS keyword filters and impress human reviewers.
            </p>
          </div>

          <form onSubmit={handleRewrite} className="card p-6 space-y-5">
            <div className="input-group">
              <label className="input-label">Target Job Title <span style={{ color: 'var(--text-faint)', textTransform: 'none', fontSize: '10px', fontWeight: 400 }}>(optional — improves relevance)</span></label>
              <input
                type="text"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="input"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Original Bullet Point</label>
              <textarea
                value={bulletPoint}
                onChange={e => setBulletPoint(e.target.value)}
                placeholder="e.g. Worked on Python backend and fixed bugs for the user upload feature..."
                rows={4}
                className="input"
              />
              <div className="input-hint">{bulletPoint.length > 0 ? `${bulletPoint.length} characters` : 'Paste your existing experience bullet here'}</div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Using: <span className="mono" style={{ color: 'var(--indigo-400)', fontSize: '11px' }}>{provider}</span>
              </p>
              <button
                type="submit"
                disabled={!bulletPoint.trim() || bulletLoading}
                className="btn btn-primary"
              >
                {bulletLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Optimizing...</span></>
                  : <><Sparkles className="w-4 h-4" /><span>Rewrite with AI</span></>
                }
              </button>
            </div>
          </form>

          {rewritten && (
            <div
              className="card p-6 space-y-4 animate-fadeUp"
              style={{ borderLeft: '3px solid var(--emerald-400)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" style={{ color: 'var(--emerald-400)' }} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--emerald-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    ATS-Optimized Result
                  </span>
                </div>
                <CopyButton text={rewritten} />
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.7', fontWeight: 500 }}>
                {rewritten}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Cover Letter ── */}
      {activeTab === 'cover_letter' && (
        <div className="space-y-5 animate-fadeUp">
          {/* Info Banner */}
          <div
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}
          >
            <FileText className="w-4 h-4 mt-0.5 shrink-0" style={{ color: 'var(--emerald-400)' }} />
            <p style={{ fontSize: '13px', color: 'var(--emerald-400)', lineHeight: '1.5' }}>
              Generate a personalized, professional cover letter tailored to the role and company. Includes company-specific language and your key highlights.
            </p>
          </div>

          <form onSubmit={handleGenerateCoverLetter} className="card p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="input-group">
                <label className="input-label">Target Job Title <span style={{ color: 'var(--rose-400)' }}>*</span></label>
                <input
                  type="text"
                  required
                  value={clJobTitle}
                  onChange={e => setClJobTitle(e.target.value)}
                  placeholder="e.g. Lead Frontend Engineer"
                  className="input"
                />
              </div>
              <div className="input-group">
                <label className="input-label">Company Name <span style={{ color: 'var(--rose-400)' }}>*</span></label>
                <input
                  type="text"
                  required
                  value={clCompany}
                  onChange={e => setClCompany(e.target.value)}
                  placeholder="e.g. Stripe, Vercel, Linear"
                  className="input"
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Key Skills & Highlights <span style={{ color: 'var(--text-faint)', textTransform: 'none', fontSize: '10px', fontWeight: 400 }}>(optional)</span></label>
              <textarea
                value={clSkills}
                onChange={e => setClSkills(e.target.value)}
                placeholder="e.g. React 18, TypeScript, System Design, 5 years experience in fintech..."
                rows={3}
                className="input"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Using: <span className="mono" style={{ color: 'var(--indigo-400)', fontSize: '11px' }}>{provider}</span>
              </p>
              <button
                type="submit"
                disabled={!clJobTitle.trim() || !clCompany.trim() || clLoading}
                className="btn btn-primary"
              >
                {clLoading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Drafting...</span></>
                  : <><Send className="w-4 h-4" /><span>Generate Cover Letter</span></>
                }
              </button>
            </div>
          </form>

          {coverLetter && (
            <div
              className="card p-6 space-y-4 animate-fadeUp"
              style={{ borderLeft: '3px solid var(--emerald-400)' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" style={{ color: 'var(--emerald-400)' }} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--emerald-400)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Cover Letter Draft
                  </span>
                </div>
                <CopyButton text={coverLetter} />
              </div>
              <div
                className="rounded-xl p-5 whitespace-pre-line"
                style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.75',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {coverLetter}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

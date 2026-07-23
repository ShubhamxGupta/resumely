import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, X, Loader2, Sparkles } from 'lucide-react';

export default function FileUploader({ onAnalyze, loading }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) setResumeFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) setResumeFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (resumeFile) onAnalyze({ resumeFile, jobDescription });
  };

  const jdChars = jobDescription.length;

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="rounded-xl overflow-hidden mb-8"
        style={{ border: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div>
            <h2 className="section-title">Analyze Your Resume</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Upload your resume and optionally paste a job description for keyword matching
            </p>
          </div>
          {resumeFile && (
            <span className="tag tag-emerald">
              <CheckCircle2 className="w-3 h-3" />
              Ready to analyze
            </span>
          )}
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Drop Zone */}
          <div
            className="p-6"
            style={{ borderRight: '1px solid var(--border-subtle)' }}
          >
            <div className="input-group mb-3">
              <label className="input-label">Resume Document</label>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                PDF, DOCX, or DOC — max 5 MB
              </p>
            </div>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('resume-input').click()}
              className="rounded-xl flex flex-col items-center justify-center text-center cursor-pointer"
              style={{
                minHeight: '180px',
                border: `2px dashed ${dragActive ? 'var(--emerald-400)' : resumeFile ? 'rgba(16,185,129,0.4)' : 'var(--border-default)'}`,
                background: dragActive
                  ? 'var(--emerald-glow)'
                  : resumeFile
                  ? 'rgba(16,185,129,0.04)'
                  : 'rgba(255,255,255,0.02)',
                transition: 'all 0.2s var(--ease-out)',
              }}
            >
              <input
                id="resume-input"
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
                className="hidden"
              />

              {resumeFile ? (
                <div className="flex flex-col items-center gap-3 px-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'var(--emerald-glow)', border: '1px solid rgba(16,185,129,0.3)' }}
                  >
                    <FileText className="w-5 h-5" style={{ color: 'var(--emerald-400)' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {resumeFile.name}
                    </p>
                    <p className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {(resumeFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); setResumeFile(null); }}
                    className="flex items-center gap-1.5"
                    style={{ fontSize: '11px', color: 'var(--rose-400)' }}
                  >
                    <X className="w-3 h-3" /> Remove
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 px-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-default)' }}
                  >
                    <Upload className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                      Drop your resume here
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      or click to browse files
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Job Description */}
          <div className="p-6 flex flex-col gap-3">
            <div className="input-group">
              <label className="input-label flex items-center justify-between">
                <span>Job Description</span>
                <span className="mono" style={{ fontSize: '10px', color: 'var(--text-faint)', textTransform: 'none' }}>
                  Optional — improves keyword matching
                </span>
              </label>
            </div>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the job description here to get a keyword gap analysis and match percentage..."
              rows={7}
              className="input flex-1"
              style={{ resize: 'none', fontSize: '13px', lineHeight: '1.65' }}
            />
            <div className="flex items-center justify-between">
              <span className="mono" style={{ fontSize: '10px', color: 'var(--text-faint)' }}>
                {jdChars > 0 ? `${jdChars} characters` : 'No job description added'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div
          className="px-6 py-4 flex items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.015)' }}
        >
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {!resumeFile
              ? 'Upload a resume file to get started'
              : loading
              ? 'Running 5-dimensional ATS analysis...'
              : 'Ready — click to run analysis'}
          </p>
          <button
            type="submit"
            disabled={!resumeFile || loading}
            className="btn btn-success"
            style={{ minWidth: '160px' }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run ATS Analysis</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function FileUploader({ onAnalyze, loading }) {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setResumeFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (resumeFile) {
      onAnalyze({ resumeFile, jobDescription });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Resume File Upload Zone */}
      <div className="surface-card p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-semibold text-slate-200">Resume Document</h2>
            <span className="text-xs text-slate-500 font-mono ml-auto">PDF, DOCX, DOC (Max 5MB)</span>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer flex flex-col items-center justify-center min-h-[180px] ${
              dragActive
                ? 'border-emerald-500 bg-emerald-500/5'
                : resumeFile
                ? 'border-emerald-500/50 bg-slate-900/40'
                : 'border-slate-700/80 hover:border-slate-600 bg-slate-900/20'
            }`}
            onClick={() => document.getElementById('resume-input').click()}
          >
            <input
              id="resume-input"
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileChange}
              className="hidden"
            />

            {resumeFile ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                <span className="text-sm font-medium text-slate-200">{resumeFile.name}</span>
                <span className="text-xs text-slate-400 font-mono">
                  {(resumeFile.size / 1024).toFixed(1)} KB
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setResumeFile(null);
                  }}
                  className="text-xs text-rose-400 hover:underline mt-1"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-slate-400 mb-1" />
                <span className="text-sm font-medium text-slate-300">
                  Drag & drop your resume file here
                </span>
                <span className="text-xs text-slate-500">or click to browse files</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Target Job Description Zone */}
      <div className="surface-card p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-semibold text-slate-200">Job Description</h2>
            <span className="text-xs text-slate-500 font-mono ml-auto">Optional Match Target</span>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target job description text here for keyword and semantic match analysis..."
            rows={7}
            className="w-full bg-[#0b1326] border border-slate-700/80 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 resize-none font-sans"
          />
        </div>

        <button
          type="submit"
          disabled={!resumeFile || loading}
          className={`w-full mt-4 py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
            !resumeFile || loading
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/20'
          }`}
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Resume & Matching Keywords...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Run ATS Analysis</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

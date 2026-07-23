import React from 'react';
import { BookOpen, CheckCircle, XCircle, Code, Briefcase, Palette } from 'lucide-react';

export default function ResourcesPage() {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <span>ATS Optimization Knowledge Base</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">Industry guidelines and formatting best practices for Applicant Tracking Systems</p>
      </div>

      {/* Do's and Don'ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="surface-card p-6 border-l-4 border-l-emerald-500">
          <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            <span>Recommended Do's</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Use standard, universally recognizable section headers (e.g., EXPERIENCE, EDUCATION, TECHNICAL SKILLS).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Explicitly list technologies, frameworks, and methodologies mentioned in the target Job Description.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Quantify achievement bullet points with metrics (percentages, dollar values, performance improvements).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Use standard professional typography (Arial, Calibri, Inter, Times New Roman).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span>Export as single-column clean PDF or DOCX documents.</span>
            </li>
          </ul>
        </div>

        <div className="surface-card p-6 border-l-4 border-l-rose-500">
          <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            <span>Critical Don'ts</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span>Avoid complex tables, multi-column CSS grids, and floating text boxes that break parser stream order.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span>Do not put critical contact details inside PDF headers or footers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span>Avoid embedded images, chart graphics, or skill rating progress circles.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-bold">•</span>
              <span>Never attempt hidden white-text keyword stuffing tricks (modern ATS screeners flag white text).</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Keywords by Industry */}
      <div className="surface-card p-6 space-y-4">
        <h3 className="text-base font-semibold text-slate-200">High-Impact Industry Keywords</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-2">
            <h4 className="text-xs font-semibold text-blue-400 font-mono flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5" />
              <span>Software Engineering</span>
            </h4>
            <p className="text-xs text-slate-400">Python, Java, JavaScript, TypeScript, React, Node.js, Docker, Kubernetes, CI/CD, Microservices, REST APIs, PostgreSQL.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-2">
            <h4 className="text-xs font-semibold text-purple-400 font-mono flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Business & Management</span>
            </h4>
            <p className="text-xs text-slate-400">Project Management, Cross-functional Leadership, Stakeholder Alignment, Budgeting, Strategic Planning, Agile/Scrum.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-2">
            <h4 className="text-xs font-semibold text-amber-400 font-mono flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              <span>UI/UX & Product Design</span>
            </h4>
            <p className="text-xs text-slate-400">Figma, Wireframing, User Research, Design Systems, Prototyping, Usability Testing, Visual Architecture, Accessibility (WCAG).</p>
          </div>
        </div>
      </div>
    </div>
  );
}

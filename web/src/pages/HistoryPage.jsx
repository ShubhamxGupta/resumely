import React, { useEffect, useState } from 'react';
import { Clock, Trash2, FileText, ArrowRight, RefreshCw } from 'lucide-react';
import { fetchHistory, deleteHistory } from '../services/api';

export default function HistoryPage({ onSelectAnalysis, token = '' }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await fetchHistory(token);
      setHistory(data || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [token]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteHistory(id, token);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('Failed to delete history item:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Analysis History</h2>
          <p className="text-xs text-slate-400 mt-1">Past resume scans and stored ATS evaluations</p>
        </div>
        <button
          onClick={loadHistory}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Refresh History"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading ? (
        <div className="surface-card p-8 text-center text-slate-400 text-sm">
          Loading historical analyses...
        </div>
      ) : history.length === 0 ? (
        <div className="surface-card p-8 text-center text-slate-400 text-sm">
          No historical analysis records found in database. Run a new scan to start building your record log!
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {history.map((item) => {
            const score = Math.round(item.ats_score || 0);
            return (
              <div
                key={item.id}
                onClick={() => onSelectAnalysis(item.analysis_result)}
                className="surface-card p-5 surface-hover cursor-pointer flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-emerald-400 text-lg">
                    {score}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{item.filename || 'Resume Document'}</h4>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(item.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { LogIn, UserPlus, LogOut, Shield, AlertCircle, CheckCircle, Mail, X } from 'lucide-react';
import { signIn, signUp, googleOAuthUrl } from '../services/supabase';

export default function AuthModal({ user, onAuthChange, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (isSignUp) {
      const res = await signUp(email, password);
      if (res.error) {
        setError(res.error);
      } else if (res.pending_confirmation) {
        setMessage(`Confirmation link sent to ${res.email}. Please verify your email.`);
      } else {
        onAuthChange({
          token: res.access_token,
          user_id: res.user_id,
          email: res.email
        });
        if (onClose) onClose();
      }
    } else {
      const res = await signIn(email, password);
      if (res.error) {
        setError(res.error);
      } else {
        onAuthChange({
          token: res.access_token,
          user_id: res.user_id,
          email: res.email
        });
        if (onClose) onClose();
      }
    }
    setLoading(false);
  };

  const handleGoogleOAuth = async () => {
    const res = await googleOAuthUrl();
    if (res.url) {
      window.location.href = res.url;
    } else {
      setError(res.error || 'Google OAuth unavailable.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#121827] border border-slate-800 rounded-2xl shadow-2xl p-6 relative space-y-5">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-indigo-400">
            <Shield className="w-4 h-4" />
            <span>{isSignUp ? 'Create Account' : 'Account Sign In'}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-100">
            {isSignUp ? 'Join Resumely Enterprise' : 'Sign In to Your Workspace'}
          </h3>
          <p className="text-xs text-slate-400">
            {isSignUp
              ? 'Save analysis scans, export formal ATS reports, and sync settings.'
              : 'Enter your credentials to access your saved resume evaluations.'}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Work Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full bg-[#090D16] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#090D16] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
          >
            {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>{loading ? 'Authenticating...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
          </button>
        </form>

        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-slate-800 w-full"></div>
          <span className="bg-[#121827] px-3 text-[10px] font-mono uppercase text-slate-500 absolute">or</span>
        </div>

        <button
          onClick={handleGoogleOAuth}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 flex items-center justify-center gap-2 transition-colors"
        >
          <Mail className="w-4 h-4 text-sky-400" />
          <span>Continue with Google</span>
        </button>

        <div className="text-center pt-2">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setMessage(null);
            }}
            className="text-xs text-indigo-400 hover:underline"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

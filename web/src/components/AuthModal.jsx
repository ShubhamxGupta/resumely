import React, { useState } from 'react';
import { LogIn, UserPlus, LogOut, Shield, AlertCircle, CheckCircle, X, Mail } from 'lucide-react';
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
        setMessage(`Confirmation link sent to ${res.email}. Check your inbox.`);
      } else {
        onAuthChange({ token: res.access_token, user_id: res.user_id, email: res.email });
        if (onClose) onClose();
      }
    } else {
      const res = await signIn(email, password);
      if (res.error) {
        setError(res.error);
      } else {
        onAuthChange({ token: res.access_token, user_id: res.user_id, email: res.email });
        if (onClose) onClose();
      }
    }
    setLoading(false);
  };

  const handleGoogleOAuth = async () => {
    const res = await googleOAuthUrl();
    if (res.url) window.location.href = res.url;
    else setError(res.error || 'Google OAuth unavailable.');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="w-full max-w-sm card animate-fadeUp"
        style={{ padding: '28px', position: 'relative', boxShadow: 'var(--shadow-lg)' }}
      >
        {/* Close */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-overlay)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
            style={{ background: 'var(--indigo-glow)', border: '1px solid rgba(99,102,241,0.3)' }}
          >
            <Shield className="w-5 h-5" style={{ color: 'var(--indigo-400)' }} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '6px' }}>
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            {isSignUp
              ? 'Save analyses, export reports, and sync settings across devices.'
              : 'Sign in to access your saved evaluations and reports.'}
          </p>
        </div>

        {/* Error / Success */}
        {error && (
          <div
            className="flex items-start gap-2.5 rounded-lg p-3 mb-4"
            style={{ background: 'var(--rose-glow)', border: '1px solid rgba(244,63,94,0.2)' }}
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--rose-400)' }} />
            <p style={{ fontSize: '12px', color: 'var(--rose-400)', lineHeight: '1.5' }}>{error}</p>
          </div>
        )}
        {message && (
          <div
            className="flex items-start gap-2.5 rounded-lg p-3 mb-4"
            style={{ background: 'var(--emerald-glow)', border: '1px solid rgba(16,185,129,0.2)' }}
          >
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--emerald-400)' }} />
            <p style={{ fontSize: '12px', color: 'var(--emerald-400)', lineHeight: '1.5' }}>{message}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="input-group">
            <label className="input-label">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input"
            />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input input-mono"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '4px' }}
          >
            {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>{loading ? 'Authenticating...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
          </button>
        </form>

        {/* Divider */}
        <div style={{ position: 'relative', margin: '20px 0', textAlign: 'center' }}>
          <hr className="divider" />
          <span
            className="mono absolute"
            style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              background: 'var(--bg-elevated)',
              padding: '0 10px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            or
          </span>
        </div>

        {/* Google OAuth */}
        <button
          onClick={handleGoogleOAuth}
          className="btn btn-ghost"
          style={{ width: '100%' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M15.68 8.18c0-.56-.05-1.09-.14-1.61H8v3.05h4.31a3.68 3.68 0 0 1-1.6 2.41v2h2.59c1.52-1.4 2.38-3.46 2.38-5.85z" fill="#4285F4"/>
            <path d="M8 16c2.16 0 3.97-.72 5.29-1.94l-2.59-2.01c-.71.48-1.63.76-2.7.76-2.08 0-3.84-1.4-4.47-3.29H.86v2.07A8 8 0 0 0 8 16z" fill="#34A853"/>
            <path d="M3.53 9.52A4.8 4.8 0 0 1 3.28 8c0-.53.09-1.04.25-1.52V4.41H.86A8 8 0 0 0 0 8c0 1.29.31 2.51.86 3.59l2.67-2.07z" fill="#FBBC05"/>
            <path d="M8 3.19c1.17 0 2.22.4 3.05 1.2l2.28-2.28A8 8 0 0 0 8 0 8 8 0 0 0 .86 4.41l2.67 2.07C4.16 4.59 5.92 3.19 8 3.19z" fill="#EA4335"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Toggle */}
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }}
            style={{ color: 'var(--indigo-400)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useAuth } from './AuthContext';
import { Zap, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginForm() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 grid-pattern radial-glow">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg,var(--primary),var(--accent))' }}>
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
            Mostafa<span style={{ color: 'var(--primary)' }}> Sherif</span>
            <span className="text-sm font-normal ml-2" style={{ color: 'var(--text-muted)' }}>Dashboard</span>
          </span>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-2xl p-8" style={{ boxShadow: '0 8px 64px rgba(16,185,129,0.1)' }}>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'var(--font-poppins)', color: 'var(--foreground)' }}>
            Welcome back
          </h1>
          <p className="text-sm mb-7" style={{ color: 'var(--text-muted)' }}>
            Sign in to manage your portfolio content.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input id="login-email" type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{ background: 'var(--background)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
                style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-poppins)' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input id="login-password" type={showPw ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
                  style={{ background: 'var(--background)', border: '1px solid var(--card-border)', color: 'var(--foreground)' }} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPw
                    ? <EyeOff className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    : <Eye className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" id="login-submit-btn" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg,var(--primary),var(--accent))', color: '#fff', fontFamily: 'var(--font-poppins)', boxShadow: '0 0 20px rgba(16,185,129,0.25)' }}>
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Sign In'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

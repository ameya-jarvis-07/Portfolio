"use client";
 
import { useEffect, useState } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';
 
async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
 
export default function LoginRoute() {
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);
 
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/auth');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            window.location.href = '/welcometocms';
          }
        }
      } catch (err) {
        console.error('Failed to load status:', err);
      } finally {
        setChecking(false);
      }
    };
    fetchStatus();
  }, []);
 
  const handleSubmit = async (event) => {
    event.preventDefault();
    setAuthError('');
    setBusy(true);
 
    try {
      const hash = await sha256(password);
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', hash })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid credentials.');
 
      window.location.href = '/welcometocms';
    } catch (error) {
      setAuthError(error.message || 'Authentication failed.');
    } finally {
      setBusy(false);
    }
  };
 
  if (checking) {
    return (
      <div className="login-screen-bg">
        <div className="login-loader">Loading access gates...</div>
      </div>
    );
  }
 
  return (
    <div className="login-screen-bg">
      <div className="login-container glass-strong">
        <div className="login-header">
          <div className="shield-icon-wrapper animate-float">
            <Shield size={32} className="shield-svg" />
          </div>
          <h2>Secure Admin Access</h2>
          <p>Provide password key to log in to your dashboard.</p>
        </div>
 
        <form className="login-form-fields" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="login-input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(p => !p)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
 
          {authError && <div className="login-error-msg">{authError}</div>}
 
          <button type="submit" className="btn btn-primary login-submit-btn" disabled={busy}>
            {busy ? 'Working...' : 'Enter Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

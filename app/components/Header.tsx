'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useUser } from '../context/UserContext';
import { login, register } from '../lib/api';

export default function Header() {
  const { user, isAuthenticated, clearSession, setSession } = useUser();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (mode === 'register') {
      if (!trimmedName) {
        setAuthError('Name is required');
        return;
      }

      if (password.length < 6) {
        setAuthError('Password must be at least 6 characters long');
        return;
      }
    }

    try {
      setSubmitting(true);
      setAuthError(null);

      const result =
        mode === 'login'
          ? await login(trimmedEmail, password)
          : await register(trimmedName, trimmedEmail, password);

      setSession(result.user, result.token);
      setIsModalOpen(false);
      setName('');
      setEmail('');
      setPassword('');
    } catch (requestError) {
      setAuthError(requestError instanceof Error ? requestError.message : 'Authentication failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link href="/" className="brand">
            Taste Journal
          </Link>

          <nav className="nav">
            <Link href="/">External Recipes</Link>
            <Link href="/my-recipes">My Recipes</Link>
          </nav>

          <div className="session-box">
            {isAuthenticated ? (
              <>
                <span className="welcome">Hi, {user?.name}</span>
                <button className="button button-secondary" onClick={clearSession}>
                  Logout
                </button>
              </>
            ) : (
              <button className="button" onClick={() => setIsModalOpen(true)}>
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      {isModalOpen ? (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <section className="modal-card" onClick={(event) => event.stopPropagation()}>
            <h2>{mode === 'login' ? 'Login' : 'Create Account'}</h2>

            <form onSubmit={handleAuthSubmit} className="stack">
              {mode === 'register' ? (
                <input
                  className="input"
                  placeholder="Name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              ) : null}

              <input
                className="input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <input
                className="input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                required
              />

              {mode === 'register' ? <p className="muted">Password must be at least 6 characters.</p> : null}

              <button className="button" type="submit" disabled={submitting}>
                {submitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
              </button>
            </form>

            {authError ? <p className="error">{authError}</p> : null}

            <div className="row">
              <button
                className="button button-secondary"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setAuthError(null);
                }}
              >
                {mode === 'login' ? 'Need account?' : 'Have account?'}
              </button>
              <button className="button button-secondary" onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

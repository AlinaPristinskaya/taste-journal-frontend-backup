'use client';

import Link from 'next/link';
import { useUser } from '../context/UserContext';

export default function Header() {
  const { user, isAuthenticated, clearSession } = useUser();

  return (
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
            <span className="welcome">Login to save recipes</span>
          )}
        </div>
      </div>
    </header>
  );
}

'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { AuthUser } from '../types';

type UserContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setSession: (nextUser: AuthUser, nextToken: string) => void;
  clearSession: () => void;
};

const UserContext = createContext<UserContextType | null>(null);

const TOKEN_KEY = 'taste_journal_token';
const USER_KEY = 'taste_journal_user';

function readStoredSession() {
  if (typeof window === 'undefined') {
    return { user: null as AuthUser | null, token: null as string | null };
  }

  const storedToken = localStorage.getItem(TOKEN_KEY);
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedToken || !storedUser) {
    return { user: null, token: null };
  }

  try {
    return {
      token: storedToken,
      user: JSON.parse(storedUser) as AuthUser,
    };
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return { user: null, token: null };
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState(readStoredSession);

  const setSession = (nextUser: AuthUser, nextToken: string) => {
    setSessionState({ user: nextUser, token: nextToken });
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  };

  const clearSession = () => {
    setSessionState({ user: null, token: null });
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const value = useMemo(
    () => ({
      user: session.user,
      token: session.token,
      isAuthenticated: Boolean(session.user && session.token),
      setSession,
      clearSession,
    }),
    [session]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used inside UserProvider');
  }

  return context;
}

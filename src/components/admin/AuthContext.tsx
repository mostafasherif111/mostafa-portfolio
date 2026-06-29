'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentSession, login, logout, getSupabaseUserSession, createUserSessionFromSupabase } from '@/services/auth';
import { initLocalStorage } from '@/services/db';
import { ensureSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import type { UserSession } from '@/services/db.types';

interface AuthCtx {
  session: UserSession | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  can: (action: 'manage_users' | 'manage_projects' | 'manage_settings' | 'view_logs') => boolean;
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initLocalStorage();
    setSession(getCurrentSession());

    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    const supabase = ensureSupabaseClient();
    let cancelled = false;

    (async () => {
      try {
        const sessionFromSupabase = await getSupabaseUserSession();
        if (!cancelled && sessionFromSupabase) {
          setSession(sessionFromSupabase);
        }
      } catch (syncError) {
        console.error('AuthProvider sync error:', syncError);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, authSession) => {
      if (cancelled) return;
      if (authSession?.user?.email) {
        setSession(createUserSessionFromSupabase(authSession.user, authSession.access_token));
      } else {
        setSession(null);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const s = await login(email, password);
    setSession(s);
  };

  const signOut = async () => {
    await logout();
    setSession(null);
  };

  const can = (action: string): boolean => {
    if (!session) return false;
    const role = session.role;
    switch (action) {
      case 'manage_users':     return role === 'super_admin';
      case 'manage_settings':  return role === 'super_admin';
      case 'manage_projects':  return role === 'super_admin' || role === 'editor';
      case 'view_logs':        return role === 'super_admin' || role === 'editor';
      default: return false;
    }
  };

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signOut, can }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

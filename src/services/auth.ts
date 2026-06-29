import type { User } from '@supabase/supabase-js';
import { UserSession } from './db.types';
import { MOCK_USERS } from './mockData';
import { ensureSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { addLog } from './db';

const SESSION_KEY = 'mostafasherif_auth_session';
const USER_ROLES_KEY = 'mostafasherif_user_roles';

// Get user roles configuration (for RBAC customization)
function getSavedRoles(): Record<string, 'super_admin' | 'editor' | 'viewer'> {
  if (typeof window === 'undefined') return {};
  const saved = localStorage.getItem(USER_ROLES_KEY);
  if (saved) return JSON.parse(saved);
  
  // Seed initial roles from MOCK_USERS
  const initialRoles: Record<string, 'super_admin' | 'editor' | 'viewer'> = {};
  MOCK_USERS.forEach(u => {
    initialRoles[u.email] = u.role as 'super_admin' | 'editor' | 'viewer';
  });
  localStorage.setItem(USER_ROLES_KEY, JSON.stringify(initialRoles));
  return initialRoles;
}

function normalizeRole(role: unknown): UserSession['role'] | null {
  if (role === 'super_admin' || role === 'editor' || role === 'viewer') return role;
  return null;
}

function getProfileRole(email: string, metadata: unknown): UserSession['role'] {
  const savedRoles = getSavedRoles();
  if (savedRoles[email]) return savedRoles[email];
  if (typeof metadata === 'object' && metadata !== null) {
    const role = normalizeRole((metadata as Record<string, unknown>).role);
    if (role) return role;
  }
  return 'viewer';
}

function getProfileName(email: string, metadata: unknown): string {
  if (typeof metadata === 'object' && metadata !== null) {
    const meta = metadata as Record<string, unknown>;
    if (typeof meta.full_name === 'string' && meta.full_name.trim()) return meta.full_name;
    if (typeof meta.name === 'string' && meta.name.trim()) return meta.name;
  }
  return email.split('@')[0];
}

export function createUserSessionFromSupabase(user: User, accessToken?: string): UserSession {
  const email = user.email || '';
  return {
    email,
    role: getProfileRole(email, user.user_metadata),
    name: getProfileName(email, user.user_metadata),
    token: accessToken,
  };
}

export async function getSupabaseUserSession(): Promise<UserSession | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = ensureSupabaseClient();
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('getSupabaseUserSession error:', error.message);
    return null;
  }
  if (!data.session?.user?.email) return null;
  return createUserSessionFromSupabase(data.session.user, data.session.access_token);
}

export function saveUserRole(email: string, role: 'super_admin' | 'editor' | 'viewer') {
  if (typeof window === 'undefined') return;
  const roles = getSavedRoles();
  roles[email] = role;
  localStorage.setItem(USER_ROLES_KEY, JSON.stringify(roles));
  addLog('System', 'Update User Role', `User ${email} assigned role ${role}.`);
}

export function getAllUsers() {
  const roles = getSavedRoles();
  return MOCK_USERS.map(u => ({
    name: u.name,
    email: u.email,
    role: roles[u.email] || u.role
  }));
}

export async function login(email: string, password: string): Promise<UserSession> {
  // 1. Supabase Mode
  if (isSupabaseConfigured()) {
    const supabase = ensureSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);

    const session: UserSession = data.user
      ? createUserSessionFromSupabase(data.user, data.session?.access_token)
      : {
          email,
          role: getSavedRoles()[email] || 'viewer',
          name: email.split('@')[0],
        };

    if (typeof window !== 'undefined') {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }

    await addLog(email, 'Login', 'Logged in via Supabase Auth.');
    return session;
  }

  // 2. Mock Mode
  const roles = getSavedRoles();
  const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
  if (!mockUser) {
    throw new Error('Invalid email or password. Hint: admin@mostafasherif.com / mostafasherif');
  }

  const session: UserSession = {
    email: mockUser.email,
    role: roles[mockUser.email] || (mockUser.role as 'super_admin' | 'editor' | 'viewer'),
    name: mockUser.name,
    token: `mock-token-${Date.now()}`
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  await addLog(email, 'Login', 'Logged in via Local Mock Auth.');
  return session;
}

export async function logout(): Promise<void> {
  const session = getCurrentSession();
  const email = session?.email || 'System';

  if (isSupabaseConfigured()) {
    const supabase = ensureSupabaseClient();
    await supabase.auth.signOut();
  }

  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }

  await addLog(email, 'Logout', 'Logged out successfully.');
}

export function getCurrentSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (!sessionStr) return null;
  
  try {
    const session = JSON.parse(sessionStr) as UserSession;
    
    // Make sure role is fresh from roles configuration (in case changed in RBAC)
    const roles = getSavedRoles();
    if (session.email && roles[session.email]) {
      session.role = roles[session.email];
    }
    return session;
  } catch {
    return null;
  }
}

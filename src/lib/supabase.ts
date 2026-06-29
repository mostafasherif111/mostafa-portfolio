import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const STORAGE_BUCKET = process.env.NEXT_PUBLIC_STORAGE_BUCKET?.trim() ?? '';

function missingEnvMessage(missing: string[]) {
  return `Missing environment variable(s): ${missing.join(', ')}. Set them and restart the app.`;
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  return Boolean(url && key);
}

export function isSupabaseStorageConfigured(): boolean {
  return Boolean(STORAGE_BUCKET);
}

// Singleton Supabase client to ensure consistent usage across the app
let supabaseClient: SupabaseClient | null = null;
export function ensureSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

  const missing: string[] = [];
  if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  if (missing.length) {
    console.error('Supabase client initialization failed:', missingEnvMessage(missing));
    throw new Error(missingEnvMessage(missing));
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseClient;
}

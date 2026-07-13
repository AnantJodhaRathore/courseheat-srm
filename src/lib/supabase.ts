import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabasePublishableKey
  ? createClient(supabaseUrl, supabasePublishableKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } })
  : null;
export const isSupabaseConfigured = Boolean(supabase);
export const SRM_EMAIL_PATTERN = /^[a-z0-9._%+-]+@srmist\.edu\.in$/i;

export async function sendMagicLink(email: string) {
  if (!supabase) throw new Error('Supabase is not configured. Add the project URL and publishable key first.');
  if (!SRM_EMAIL_PATTERN.test(email.trim())) throw new Error('Use your @srmist.edu.in student email.');
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: { emailRedirectTo: window.location.origin }
  });
  if (error) throw error;
}

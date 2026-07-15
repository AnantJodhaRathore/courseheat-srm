import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabasePublishableKey
    ? createClient(supabaseUrl, supabasePublishableKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      })
    : null;

export const isSupabaseConfigured = Boolean(supabase);

export const SRM_EMAIL_PATTERN =
  /^[a-z0-9._%+-]+@srmist\.edu\.in$/i;

export async function sendMagicLink(email: string) {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add the project URL and publishable key first.'
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!SRM_EMAIL_PATTERN.test(normalizedEmail)) {
    throw new Error('Use your @srmist.edu.in student email.');
  }

  const emailRedirectTo = new URL(
    import.meta.env.BASE_URL,
    window.location.origin
  ).toString();

  const { error } = await supabase.auth.signInWithOtp({
    email: normalizedEmail,
    options: {
      emailRedirectTo
    }
  });

  if (error) throw error;
}
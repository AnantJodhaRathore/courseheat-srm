import { useEffect, useState } from 'react';
import { MailCheck, ShieldCheck, X } from 'lucide-react';
import { isSupabaseConfigured, sendMagicLink, SRM_EMAIL_PATTERN } from '../lib/supabase';

type Props = { open: boolean; onClose: () => void; onDemoLogin: (email: string) => void; onNotice: (message: string, kind?: 'success' | 'error' | 'info') => void };

export function AuthDialog({ open, onClose, onDemoLogin, onNotice }: Props) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => { if (open) setError(''); }, [open]);
  if (!open) return null;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!SRM_EMAIL_PATTERN.test(email.trim())) { setError('Enter a valid @srmist.edu.in email address.'); return; }
    if (!isSupabaseConfigured) { setError('Cloud authentication is not configured in this deployment. Use the portfolio demo below.'); return; }
    try { setBusy(true); setError(''); await sendMagicLink(email); onNotice('Magic link sent. Check your SRM inbox.', 'success'); onClose(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not send the magic link.'); }
    finally { setBusy(false); }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="auth-dialog card" role="dialog" aria-modal="true" aria-labelledby="auth-title" onMouseDown={(e) => e.stopPropagation()}>
        <button className="icon-button modal-close" onClick={onClose} aria-label="Close login"><X /></button>
        <div className="auth-icon"><ShieldCheck /></div>
        <p className="eyebrow">Student-only community</p>
        <h2 id="auth-title">Sign in with your SRM email</h2>
        <p className="muted">We send a one-time magic link. CourseHeat never asks for or stores your SRM password.</p>
        <form onSubmit={submit} className="auth-form">
          <label>SRM email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student@srmist.edu.in" autoFocus /></label>
          {error && <p className="field-error" role="alert">{error}</p>}
          <button className="button primary" disabled={busy}><MailCheck size={18} />{busy ? 'Sending…' : 'Send magic link'}</button>
        </form>
        {!isSupabaseConfigured && (
          <div className="demo-login">
            <span>Portfolio preview</span>
            <p>Use a clearly marked local demo session to try saving and reviewing. No email is sent.</p>
            <button className="button ghost" onClick={() => { onDemoLogin('demo.student@srmist.edu.in'); onNotice('Signed in to the local demo.', 'success'); onClose(); }}>Continue as demo student</button>
          </div>
        )}
        <p className="privacy-note">By continuing, you confirm you are an SRM student. Community reviews are moderated and may be reported.</p>
      </section>
    </div>
  );
}

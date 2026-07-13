import { BookOpenCheck, LockKeyhole, MailCheck, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { isSupabaseConfigured, sendMagicLink, SRM_EMAIL_PATTERN } from '../lib/supabase';

export function AuthGate({ checking, onNotice }: { checking: boolean; onNotice: (message: string, kind?: 'success' | 'error' | 'info') => void }) {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!SRM_EMAIL_PATTERN.test(email.trim())) { setError('Enter a valid @srmist.edu.in student email.'); return; }
    if (!isSupabaseConfigured) { setError('Authentication is not configured. Add the Supabase project credentials to enable access.'); return; }
    try {
      setBusy(true); setError(''); await sendMagicLink(email); setSent(true);
      onNotice('Verification link sent to your SRM inbox.', 'success');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Could not send the verification link.'); }
    finally { setBusy(false); }
  }

  if (checking) return <main className="auth-gate"><div className="auth-checking"><span className="auth-spinner" /><strong>Verifying your session…</strong><p>Please wait while CourseHeat checks your secure login.</p></div></main>;

  return <main className="auth-gate">
    <section className="auth-brand-panel">
      <a className="auth-brand" href="/" aria-label="CourseHeat home"><img src="/logo.svg" alt="" /><span>CourseHeat</span><b>SRM</b></a>
      <div className="auth-brand-copy"><p className="eyebrow"><Sparkles size={15} />Student course intelligence</p><h1>Make every semester decision with confidence.</h1><p>Compare courses, professors, workload, grades, attendance, and honest student experiences in one private SRM community.</p>
        <div className="auth-benefits"><span><BookOpenCheck />Course and professor insights</span><span><ShieldCheck />Verified SRM students only</span><span><LockKeyhole />No university password collected</span></div>
      </div>
      <p className="auth-disclaimer">Independent student project. Not affiliated with SRM Institute of Science and Technology.</p>
    </section>
    <section className="auth-form-panel">
      <div className="auth-card card">
        <div className="auth-icon"><ShieldCheck /></div>
        <p className="eyebrow">Protected access</p>
        <h2>Verify your student email</h2>
        <p className="muted">CourseHeat is available only to verified SRM students. We’ll send a one-time sign-in link to your institutional inbox.</p>
        {sent ? <div className="auth-sent"><MailCheck /><h3>Check your inbox</h3><p>Open the link sent to <strong>{email}</strong> to enter CourseHeat.</p><button className="button ghost" onClick={() => setSent(false)}>Use a different email</button></div> : <form className="auth-form" onSubmit={submit}>
          <label>SRM student email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="student@srmist.edu.in" autoComplete="email" autoFocus disabled={!isSupabaseConfigured} /></label>
          {error && <p className="field-error" role="alert">{error}</p>}
          {!isSupabaseConfigured && <p className="auth-setup-note"><LockKeyhole size={15} />Administrator setup required: configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.</p>}
          <button className="button primary" disabled={busy || !isSupabaseConfigured}><MailCheck size={18} />{busy ? 'Sending secure link…' : 'Send verification link'}</button>
        </form>}
        <div className="auth-privacy"><LockKeyhole size={16} /><span>We never ask for your SRM NetID password or access the Academia portal.</span></div>
      </div>
    </section>
  </main>;
}

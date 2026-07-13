import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react';
import type { ToastMessage } from '../types';

export function ToastStack({ toasts, onDismiss }: { toasts: ToastMessage[]; onDismiss: (id: string) => void }) {
  const icons = { success: CheckCircle2, error: CircleAlert, info: Info };
  return <div className="toast-stack" aria-live="polite">{toasts.map((toast) => { const Icon = icons[toast.kind]; return (
    <div className={`toast ${toast.kind}`} key={toast.id}><Icon size={19} /><span>{toast.message}</span><button onClick={() => onDismiss(toast.id)} aria-label="Dismiss"><X size={16} /></button></div>
  ); })}</div>;
}

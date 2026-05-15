import { X, Briefcase, AlertCircle, CheckCircle } from 'lucide-react';

type Props = {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
  variant?: 'error' | 'info' | 'success';
};

export default function AuthAlertModal({
  open,
  title,
  message,
  onClose,
  variant = 'error',
}: Props) {
  if (!open) return null;

  const Icon = variant === 'error' ? AlertCircle : variant === 'success' ? CheckCircle : Briefcase;
  const accent =
    variant === 'error'
      ? 'border-red-200 bg-red-50/90 text-red-800'
      : variant === 'success'
        ? 'border-emerald-200 bg-emerald-50/90 text-emerald-900'
        : 'border-sky-200 bg-sky-50/90 text-sky-900';

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-alert-title"
      aria-describedby="auth-alert-desc"
    >
      <div
        className={`relative w-full max-w-md rounded-2xl border shadow-2xl ${accent}`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 rounded-lg p-1.5 hover:bg-black/5 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="p-6 pt-8">
          <div className="flex items-start gap-3 mb-3">
            <div className="mt-0.5 rounded-full bg-white/80 p-2 shadow-sm">
              <Icon className="w-6 h-6 shrink-0" />
            </div>
            <div>
              <h2 id="auth-alert-title" className="text-lg font-bold tracking-tight">
                {title}
              </h2>
              <p id="auth-alert-desc" className="mt-2 text-sm leading-relaxed opacity-95">
                {message}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full rounded-xl bg-gray-900 text-white py-3 text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            {variant === 'error' ? 'Review and try again' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
}

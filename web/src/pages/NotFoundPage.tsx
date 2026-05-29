import { GlassCard } from "../components/GlassCard";
import { Link } from 'react-router-dom';
import { MapPinOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function NotFoundPage() {
  const { token } = useAuth();
  const homeHref = token ? '/' : '/login';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-[linear-gradient(168deg,var(--color-brand-surface-tint)_0%,#ffffff_50%,var(--color-brand-gradient-from)_100%)]">
      <div className="rounded-2xl border border-sky-100 bg-white/90 shadow-xl px-10 py-12 max-w-lg">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-red/10 text-brand-red">
          <MapPinOff className="h-8 w-8" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red mb-2">404 — listing not found</p>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">This URL is not on the job board</h1>
        <p className="text-gray-600 text-sm leading-relaxed mb-8">
          Like a role that was filled or removed, this page does not exist. Check the address for typos, or head back to
          your dashboard home.
        </p>
        <Link
          to={homeHref}
          className="inline-flex items-center justify-center rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-red/25 hover:bg-brand-red-dark active:bg-brand-red-active transition-colors"
        >
          {token ? 'Return to home' : 'Go to sign in'}
        </Link>
      </div>
    </div>
  );
}

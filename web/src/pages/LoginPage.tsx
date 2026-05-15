import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, type AuthActionFail } from '../context/AuthContext';
import AuthAlertModal from '../components/AuthAlertModal';
import { loginFailureMessage } from '../lib/authMessages';

export default function LoginPage() {
  const { login, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = useMemo(() => {
    const s = location.state as { from?: { pathname?: string } } | undefined;
    const p = s?.from?.pathname;
    if (p && p !== '/login') return p;
    return '/';
  }, [location.state]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [errorModal, setErrorModal] = useState<{ title: string; message: string } | null>(null);

  useEffect(() => {
    const st = location.state as { registered?: boolean; role?: string } | null;
    if (st?.registered) {
      const roleLabel =
        st.role === 'employer' ? 'employer workspace' : 'candidate profile';
      setBanner(`Success — your ${roleLabel} was created. Sign in below to open the job board.`);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (token) {
      navigate(fromPath, { replace: true });
    }
  }, [token, fromPath, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await login(email.trim(), password);
    setBusy(false);
    if (res.ok) {
      navigate(fromPath, { replace: true });
    } else {
      const fail = res as AuthActionFail;
      setErrorModal({
        title: 'Could not clock you in',
        message: loginFailureMessage(fail.status, fail.data),
      });
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 text-white relative overflow-hidden bg-[linear-gradient(148deg,var(--color-brand-gradient-from)_0%,var(--color-brand-gradient-via)_48%,var(--color-brand-gradient-to)_100%)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full -ml-48 -mb-48" />

        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-bold mb-6">Empowering Egypt&apos;s Future Tech Leaders</h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Sign in to browse approved listings, manage applications, and keep your hiring pipeline moving.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 mt-2">Use the email and password tied to your ITI Careers account.</p>
          </div>

          {banner && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-900 text-sm px-4 py-3 leading-relaxed">
              {banner}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-800">Email</label>
              <input
                required
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-800">Password</label>
              <input
                required
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-brand-red hover:bg-brand-red-dark active:bg-brand-red-active text-white py-3 rounded-lg font-semibold transition-all shadow-lg shadow-brand-red/25 disabled:opacity-60"
            >
              {busy ? 'Signing you in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            New here?{' '}
            <Link to="/register" className="text-brand-red font-bold hover:underline">
              Choose a registration path
            </Link>
          </p>
        </div>
      </div>

      <AuthAlertModal
        open={!!errorModal}
        title={errorModal?.title ?? ''}
        message={errorModal?.message ?? ''}
        onClose={() => setErrorModal(null)}
        variant="error"
      />
    </div>
  );
}

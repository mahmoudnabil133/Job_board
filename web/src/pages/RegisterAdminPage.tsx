import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, type AuthActionFail } from '../context/AuthContext';
import AuthAlertModal from '../components/AuthAlertModal';
import { registerFailureMessage } from '../lib/authMessages';

export default function RegisterAdminPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [modal, setModal] = useState<{ title: string; message: string } | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const res = await register({
      name: name.trim(),
      email: email.trim(),
      password,
      password_confirmation: passwordConfirmation,
      role: 'admin',
    });
    setBusy(false);
    if (res.ok) {
      navigate('/login', { replace: true, state: { registered: true, role: 'admin' } });
    } else {
      const fail = res as AuthActionFail;
      setModal({
        title: 'Admin account not created',
        message: registerFailureMessage(fail.status, fail.data),
      });
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white/90">
      <header className="border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/register" className="text-sm font-semibold text-brand-red hover:underline">
            ← All registration options
          </Link>
          <Link to="/login" className="text-sm text-gray-600 hover:text-brand-red">
            Sign in
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-indigo-100 bg-white shadow-xl p-8">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-700 mb-2">Administrator</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Platform admin signup</h1>
          <p className="text-sm text-gray-600 mb-4">
            Backend role: <strong>admin</strong> — used for routes such as approving or rejecting job postings (
            <code className="text-xs bg-gray-100 px-1 rounded">/v1/admin/jobs/…</code>
            ). Only continue if you are authorized ITI staff.
          </p>
          <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-900 text-xs p-3 mb-6 leading-relaxed">
            Public self-registration for admins is unusual in production. This form exists because the API allows it; your organization may restrict who may hold this role.
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-800">Administrator name</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-800">Staff email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-800">Password</label>
              <input
                required
                type="password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-800">Confirm password</label>
              <input
                required
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="mt-1 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 transition-all"
            >
              {busy ? 'Provisioning admin access…' : 'Create admin account'}
            </button>
          </form>
        </div>
      </div>

      <AuthAlertModal
        open={!!modal}
        title={modal?.title ?? ''}
        message={modal?.message ?? ''}
        onClose={() => setModal(null)}
        variant="error"
      />
    </div>
  );
}

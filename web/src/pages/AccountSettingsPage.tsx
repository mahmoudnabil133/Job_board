import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  changePassword,
  getMyActivityLogs,
} from '../services/jobBoardApi';
import { flattenApiErrors, isFetchJsonFailure } from '../lib/api';
import type { ApiActivityLog } from '../types/api';

export default function AccountSettingsPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwErr, setPwErr] = useState<string | null>(null);
  const [pwBusy, setPwBusy] = useState(false);

  const [logs, setLogs] = useState<ApiActivityLog[]>([]);
  const [logsErr, setLogsErr] = useState<string | null>(null);

  const loadLogs = useCallback(async () => {
    if (!token) return;
    const res = await getMyActivityLogs(token, 1);
    if (isFetchJsonFailure(res)) {
      setLogsErr(flattenApiErrors(res.data).join(' ') || 'Could not load activity history.');
      setLogs([]);
      return;
    }
    setLogsErr(null);
    setLogs(res.items);
  }, [token]);

  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  async function onChangePassword(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setPwErr(null);
    setPwBusy(true);
    const res = await changePassword(token, currentPassword, newPassword);
    setPwBusy(false);
    if (isFetchJsonFailure(res)) {
      setPwErr(flattenApiErrors(res.data).join(' ') || 'Password was not updated.');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Account & security</h1>
          <p className="text-gray-600 mt-1 text-sm">Change your password and review recent account activity.</p>
        </div>

        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-lg mb-4">Change password</h2>
          <p className="text-xs text-gray-500 mb-4">
            Uses <code className="bg-gray-100 px-1 rounded">POST /api/v1/user/change-password</code>. All tokens are revoked after a successful change.
          </p>
          <form onSubmit={(e) => void onChangePassword(e)} className="space-y-4 max-w-md">
            {pwErr && <p className="text-sm text-red-800 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{pwErr}</p>}
            <div>
              <label className="text-sm font-medium text-gray-800">Current password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-red"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-800">New password</label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-brand-red"
              />
            </div>
            <button
              type="submit"
              disabled={pwBusy}
              className="bg-brand-red text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-brand-red-dark disabled:opacity-60"
            >
              {pwBusy ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </section>

        <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-lg mb-2">Your activity log</h2>
          <p className="text-xs text-gray-500 mb-4">
            From <code className="bg-gray-100 px-1 rounded">GET /api/v1/logs/my-activity-logs</code>.
          </p>
          {logsErr && <p className="text-sm text-red-700 mb-3">{logsErr}</p>}
          <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
            {logs.map((row) => (
              <li key={row.id} className="px-4 py-3 text-sm bg-white">
                <p className="font-medium text-gray-900">{row.action}</p>
                <p className="text-gray-600">{row.description}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(row.created_at).toLocaleString()}</p>
              </li>
            ))}
            {logs.length === 0 && !logsErr && (
              <li className="px-4 py-6 text-sm text-gray-500 text-center">No activity entries yet.</li>
            )}
          </ul>
        </section>

        <p className="text-center text-sm text-gray-500">
          <Link to="/" className="text-brand-red font-semibold hover:underline">
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

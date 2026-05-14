import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/jobBoardApi';
import { flattenApiErrors, isFetchJsonFailure } from '../lib/api';
import type { ApiNotification } from '../types/api';

export default function NotificationsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<ApiNotification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const res = await getNotifications(token, 1);
    setLoading(false);
    if (isFetchJsonFailure(res)) {
      setError(flattenApiErrors(res.data).join(' ') || 'Could not load notifications.');
      setItems([]);
      return;
    }
    setError(null);
    setItems(res.items);
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  async function onRead(id: number) {
    if (!token) return;
    const res = await markNotificationRead(token, id);
    if (!isFetchJsonFailure(res)) void load();
  }

  async function onReadAll() {
    if (!token) return;
    const res = await markAllNotificationsRead(token);
    if (!isFetchJsonFailure(res)) void load();
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <button
            type="button"
            onClick={() => void onReadAll()}
            className="text-sm font-semibold text-brand-red hover:underline"
          >
            Mark all read
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <div className="h-9 w-9 rounded-full border-2 border-brand-red border-t-transparent animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="rounded-xl border border-red-200 bg-red-50 text-red-800 px-4 py-3 text-sm">{error}</div>
        )}

        {!loading && (
          <ul className="space-y-3">
            {items.map((n) => (
              <li
                key={n.id}
                className={`rounded-xl border px-4 py-3 shadow-sm ${
                  n.is_read ? 'bg-white border-gray-100' : 'bg-sky-50 border-sky-100'
                }`}
              >
                <div className="flex justify-between gap-2">
                  <p className="font-semibold text-gray-900 text-sm">{n.title}</p>
                  {!n.is_read && (
                    <button
                      type="button"
                      onClick={() => void onRead(n.id)}
                      className="text-xs font-bold text-brand-red shrink-0 hover:underline"
                    >
                      Mark read
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{n.message}</p>
                <p className="text-xs text-gray-400 mt-2">{n.created_at_human ?? n.created_at}</p>
              </li>
            ))}
            {items.length === 0 && !error && (
              <p className="text-center text-gray-500 text-sm py-12">You have no notifications yet.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getUnreadNotificationCount, getTotalUnreadMessages } from '../services/jobBoardApi';
import { isFetchJsonFailure } from '../lib/api';
import { NAV_BADGES_EVENT, type NavBadgesDetail } from '../lib/navBadges';
import type { AuthUserRole } from '../types';

function dashboardHref(role: AuthUserRole): string {
  switch (role) {
    case 'candidate':
      return '/dashboard/candidate';
    case 'employer':
      return '/dashboard/employer';
    case 'admin':
      return '/dashboard/admin';
    default:
      return '/';
  }
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function badgeSpan(count: number) {
  if (count <= 0) return null;
  return (
    <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-red text-white text-[10px] font-bold flex items-center justify-center">
      {count > 99 ? '99+' : count}
    </span>
  );
}

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const canMessage = user?.role === 'candidate' || user?.role === 'employer';

  const refetchAlerts = useCallback(async () => {
    if (!token) {
      setUnreadAlerts(0);
      return;
    }
    const res = await getUnreadNotificationCount(token);
    if (!isFetchJsonFailure(res)) setUnreadAlerts(res.count);
  }, [token]);

  const refetchMessages = useCallback(async () => {
    if (!token) {
      setUnreadMessages(0);
      return;
    }
    if (user?.role !== 'candidate' && user?.role !== 'employer') {
      setUnreadMessages(0);
      return;
    }
    const n = await getTotalUnreadMessages(token);
    setUnreadMessages(n);
  }, [token, user?.role]);

  const refetchBoth = useCallback(async () => {
    await Promise.all([refetchAlerts(), refetchMessages()]);
  }, [refetchAlerts, refetchMessages]);

  useEffect(() => {
    if (!token) {
      setUnreadAlerts(0);
      setUnreadMessages(0);
      return;
    }
    let cancelled = false;
    void (async () => {
      await refetchBoth();
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [token, user?.id, refetchBoth]);

  useEffect(() => {
    function onBadges(ev: Event) {
      const ce = ev as CustomEvent<NavBadgesDetail>;
      const d = ce.detail;
      if (!d) {
        void refetchBoth();
        return;
      }
      switch (d.mode) {
        case 'refetch-alerts':
          void refetchAlerts();
          break;
        case 'refetch-messages':
          void refetchMessages();
          break;
        case 'refetch-both':
          void refetchBoth();
          break;
        case 'delta-alerts':
          setUnreadAlerts((u) => Math.max(0, u + d.delta));
          break;
        case 'delta-messages':
          setUnreadMessages((u) => Math.max(0, u + d.delta));
          break;
        case 'message-notification-read':
          setUnreadAlerts((u) => Math.max(0, u - 1));
          setUnreadMessages((u) => Math.max(0, u - 1));
          break;
        case 'conversation-read':
          setUnreadMessages((u) => Math.max(0, u - d.clearedUnread));
          break;
        default:
          void refetchBoth();
      }
    }
    window.addEventListener(NAV_BADGES_EVENT, onBadges);
    return () => window.removeEventListener(NAV_BADGES_EVENT, onBadges);
  }, [refetchAlerts, refetchMessages, refetchBoth]);

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl shadow-sm shadow-slate-900/5">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-black flex items-center justify-center shadow-lg shadow-indigo-500/20">
            JW
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">Job Work</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {user?.role === 'candidate' && (
            <Link to="/jobs" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors">
              Find Jobs
            </Link>
          )}
          <Link to="/companies" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors">
            Companies
          </Link>
          <Link to="/style-guide" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors">
            Style Guide
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/notifications"
                className="relative text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Alerts
                {badgeSpan(unreadAlerts)}
              </Link>
              <Link
                to="/messages"
                className="relative text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
              >
                Messages
                {canMessage ? badgeSpan(unreadMessages) : null}
              </Link>
              <Link to="/settings" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors">
                Settings
              </Link>
              <Link
                to={dashboardHref(user.role)}
                className="flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-2 py-1 hover:border-indigo-200 hover:shadow-sm transition-all"
              >
                <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-700">
                  {initials(user.name)}
                </div>
                <span className="text-sm font-semibold text-slate-700 max-w-[140px] truncate">{user.name}</span>
              </Link>
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Log out
              </button>
              <ThemeContext.Consumer>
                {({ dark, toggleTheme }) => (
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="ml-2 p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    aria-label="Toggle dark mode"
                  >
                    {dark ? '☀️' : '🌙'}
                  </button>
                )}
              </ThemeContext.Consumer>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors">
                Log In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-red flex items-center justify-center text-white font-black text-lg rounded-lg">
          JW
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">Job Work</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {user?.role === 'candidate' && (
            <Link to="/jobs" className="text-sm font-medium text-gray-600 hover:text-brand-red transition-colors">
              Find Jobs
            </Link>
          )}
          <Link to="/companies" className="text-sm font-medium text-gray-600 hover:text-brand-red transition-colors">
            Companies
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/notifications"
                className="relative text-sm font-medium text-gray-600 hover:text-brand-red transition-colors"
              >
                Alerts
                {badgeSpan(unreadAlerts)}
              </Link>
              <Link
                to="/messages"
                className="relative text-sm font-medium text-gray-600 hover:text-brand-red transition-colors"
              >
                Messages
                {canMessage ? badgeSpan(unreadMessages) : null}
              </Link>
              <Link to="/settings" className="text-sm font-medium text-gray-600 hover:text-brand-red transition-colors">
                Settings
              </Link>
              <Link
                to={dashboardHref(user.role)}
                className="flex items-center gap-2 group rounded-lg pr-2 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-600 group-hover:bg-brand-red group-hover:text-white transition-all">
                  {initials(user.name)}
                </div>
                <span className="text-sm font-medium text-gray-800 max-w-[140px] truncate">{user.name}</span>
              </Link>
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="text-sm font-medium text-gray-500 hover:text-brand-red transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-brand-red transition-colors">
                Log In
              </Link>
              <Link
                to="/register"
                className="bg-brand-red text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-red-dark active:bg-brand-red-active transition-all shadow-md shadow-brand-red/20"
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

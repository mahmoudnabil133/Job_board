import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { AuthUserRole } from '../types';

type Props = {
  allow: AuthUserRole[];
};

export default function RoleRoute({ allow }: Props) {
  const { user, token, initializing } = useAuth();

  if (initializing || !token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-gray-600">
        <div className="h-9 w-9 rounded-full border-2 border-brand-red border-t-transparent animate-spin" />
        <p className="text-sm font-medium">Verifying your role…</p>
      </div>
    );
  }

  if (!user || !allow.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleRoute({ role, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.rol !== role) {
    const fallback = user.rol === 'admin' ? '/admin/dashboard' : '/valuador/dashboard';
    return <Navigate to={fallback} replace />;
  }
  return children;
}

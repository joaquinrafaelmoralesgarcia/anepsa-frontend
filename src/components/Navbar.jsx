import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';

export default function Navbar() {
  const { user, refreshToken, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await authService.logout(refreshToken);
    logout();
    navigate('/login');
  }

  const isAdmin = user?.rol === 'admin';

  return (
    <nav style={{ background: '#1e293b', color: '#f8fafc', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <strong style={{ fontSize: '18px' }}>ANEPSA</strong>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {isAdmin ? (
          <>
            <Link to="/admin/dashboard" style={{ color: '#94a3b8', textDecoration: 'none' }}>Dashboard</Link>
            <Link to="/admin/clientes" style={{ color: '#94a3b8', textDecoration: 'none' }}>Clientes</Link>
            <Link to="/admin/inmuebles" style={{ color: '#94a3b8', textDecoration: 'none' }}>Inmuebles</Link>
            <Link to="/admin/ordenes" style={{ color: '#94a3b8', textDecoration: 'none' }}>Órdenes</Link>
            <Link to="/admin/usuarios" style={{ color: '#94a3b8', textDecoration: 'none' }}>Usuarios</Link>
            <Link to="/admin/actividad" style={{ color: '#94a3b8', textDecoration: 'none' }}>Actividad</Link>
          </>
        ) : (
          <>
            <Link to="/valuador/dashboard" style={{ color: '#94a3b8', textDecoration: 'none' }}>Mis Órdenes</Link>
            <Link to="/valuador/notificaciones" style={{ color: '#94a3b8', textDecoration: 'none' }}>Notificaciones</Link>
          </>
        )}
        <span style={{ color: '#64748b', fontSize: '13px' }}>{user?.nombre}</span>
        <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer' }}>
          Salir
        </button>
      </div>
    </nav>
  );
}

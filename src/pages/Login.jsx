import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  function validate() {
    const errs = {};
    if (!email) errs.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Email inválido';
    if (!password) errs.password = 'La contraseña es requerida';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setApiError('');
    setLoading(true);
    try {
      const data = await loginService(email, password);
      login(data.user, data.accessToken, data.refreshToken);
      navigate(data.user.rol === 'admin' ? '/admin/dashboard' : '/valuador/dashboard');
    } catch (err) {
      setApiError(err.response?.data?.error?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', width: '100%', maxWidth: '380px' }}>
        <h1 style={{ textAlign: 'center', color: '#1e293b', marginBottom: '24px', fontSize: '24px' }}>ANEPSA</h1>
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#475569' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              style={{ width: '100%', padding: '10px', border: errors.email ? '1px solid #ef4444' : '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            />
            {errors.email && <span role="alert" style={{ color: '#ef4444', fontSize: '12px' }}>{errors.email}</span>}
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#475569' }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px', border: errors.password ? '1px solid #ef4444' : '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            />
            {errors.password && <span role="alert" style={{ color: '#ef4444', fontSize: '12px' }}>{errors.password}</span>}
          </div>
          {apiError && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>{apiError}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}

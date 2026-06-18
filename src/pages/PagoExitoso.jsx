import { useNavigate } from 'react-router-dom';

export default function PagoExitoso() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '48px', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', maxWidth: '420px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ color: '#166534', margin: '0 0 8px' }}>¡Pago exitoso!</h2>
        <p style={{ color: '#475569', margin: '0 0 24px' }}>
          El anticipo fue procesado correctamente. La orden ha sido actualizada.
        </p>
        <button onClick={() => navigate('/admin/ordenes')}
          style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' }}>
          Ver mis órdenes
        </button>
      </div>
    </div>
  );
}

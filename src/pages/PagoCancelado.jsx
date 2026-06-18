import { useNavigate } from 'react-router-dom';

export default function PagoCancelado() {
  const navigate = useNavigate();
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '48px', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', maxWidth: '420px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>❌</div>
        <h2 style={{ color: '#991b1b', margin: '0 0 8px' }}>Pago cancelado</h2>
        <p style={{ color: '#475569', margin: '0 0 24px' }}>
          El pago fue cancelado. Puedes intentarlo de nuevo desde el detalle de la orden.
        </p>
        <button onClick={() => navigate('/admin/ordenes')}
          style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '15px' }}>
          Volver a órdenes
        </button>
      </div>
    </div>
  );
}

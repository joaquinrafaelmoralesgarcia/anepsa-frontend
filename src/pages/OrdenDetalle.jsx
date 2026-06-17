import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import { getOrden, updateOrden } from '../services/ordenesService';
import { useAuth } from '../context/AuthContext';

export default function OrdenDetalle() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orden, setOrden] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrden(id).then(setOrden).finally(() => setLoading(false));
  }, [id]);

  async function handleCambioEstatus() {
    const nuevoEstatus = prompt('Nuevo estatus (pendiente / en proceso / completada / cancelada):', orden.estatus);
    if (!nuevoEstatus) return;
    const updated = await updateOrden(id, { estatus: nuevoEstatus });
    setOrden(updated);
  }

  if (loading) return <Layout><p>Cargando...</p></Layout>;
  if (!orden) return <Layout><p>Orden no encontrada</p></Layout>;

  const backPath = user?.rol === 'admin' ? '/admin/ordenes' : '/valuador/dashboard';

  return (
    <Layout>
      <button onClick={() => navigate(backPath)} style={{ background: 'transparent', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginBottom: '16px' }}>
        ← Volver
      </button>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: '0 0 16px', color: '#1e293b' }}>Detalle de orden</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          <Row label="Inmueble" value={orden.inmueble?.direccion} />
          <Row label="Tipo" value={orden.inmueble?.tipo} />
          <Row label="Valuador" value={orden.valuadorAsignado?.nombre || 'Sin asignar'} />
          <Row label="Monto" value={`$${orden.monto?.toLocaleString('es-MX')}`} />
          <Row label="Anticipo (sin IVA)" value={`$${orden.anticipo?.toLocaleString('es-MX')}`} />
          <Row label="Fecha" value={orden.fecha ? new Date(orden.fecha).toLocaleDateString('es-MX') : '—'} />
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '14px', minWidth: '140px' }}>Estatus</span>
            <StatusBadge estatus={orden.estatus} pagoAnticipo={orden.pagoAnticipo} anticipoUrl={orden.anticipoUrl} />
          </div>
        </div>
        {user?.rol === 'admin' && (
          <button onClick={handleCambioEstatus} style={{ marginTop: '24px', background: '#6366f1', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
            Cambiar estatus
          </button>
        )}
      </div>
    </Layout>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <span style={{ color: '#64748b', fontSize: '14px', minWidth: '140px' }}>{label}</span>
      <span style={{ color: '#1e293b', fontSize: '14px', fontWeight: 500 }}>{value}</span>
    </div>
  );
}

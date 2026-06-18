import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import StatusBadge from '../components/StatusBadge';
import { getOrden, updateOrden } from '../services/ordenesService';
import { useAuth } from '../context/AuthContext';
import apiClient from '../services/apiClient';

const modalStyle = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
};
const cardStyle = {
  background: '#fff', borderRadius: '12px', padding: '28px',
  width: '400px', maxWidth: '90vw', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
};
const inputStyle = {
  width: '100%', padding: '8px 12px', borderRadius: '6px',
  border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box',
};
const labelStyle = { fontSize: '13px', color: '#475569', marginBottom: '4px', display: 'block' };

const ESTATUS = ['pendiente', 'en proceso', 'completada', 'cancelada'];

export default function OrdenDetalle() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orden, setOrden] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal estatus
  const [showEstatus, setShowEstatus] = useState(false);
  const [nuevoEstatus, setNuevoEstatus] = useState('');
  const [savingEstatus, setSavingEstatus] = useState(false);

  // Modal valuador
  const [showValuador, setShowValuador] = useState(false);
  const [valuadores, setValuadores] = useState([]);
  const [valuadorId, setValuadorId] = useState('');
  const [savingValuador, setSavingValuador] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    getOrden(id).then((o) => {
      setOrden(o);
      setNuevoEstatus(o?.estatus || 'pendiente');
    }).finally(() => setLoading(false));
  }, [id]);

  async function openValuadorModal() {
    setErrorMsg('');
    setValuadorId(orden?.valuadorAsignado?._id || '');
    const res = await apiClient.get('/usuarios');
    setValuadores(res.data.data.filter((u) => u.rol === 'valuador' && u.activo !== false));
    setShowValuador(true);
  }

  async function handleAsignarValuador(e) {
    e.preventDefault();
    if (!valuadorId) { setErrorMsg('Selecciona un valuador'); return; }
    setSavingValuador(true);
    try {
      const updated = await updateOrden(id, { valuadorAsignado: valuadorId, estatus: 'en proceso' });
      setOrden(updated);
      setShowValuador(false);
    } catch (e) {
      setErrorMsg(e.response?.data?.error?.message || 'Error al asignar valuador');
    } finally {
      setSavingValuador(false);
    }
  }

  async function handleCambioEstatus(e) {
    e.preventDefault();
    if (!nuevoEstatus) return;
    setSavingEstatus(true);
    try {
      const updated = await updateOrden(id, { estatus: nuevoEstatus });
      setOrden(updated);
      setShowEstatus(false);
    } catch (e) {
      setErrorMsg(e.response?.data?.error?.message || 'Error al cambiar estatus');
    } finally {
      setSavingEstatus(false);
    }
  }

  if (loading) return <Layout><p>Cargando...</p></Layout>;
  if (!orden) return <Layout><p>Orden no encontrada</p></Layout>;

  const backPath = user?.rol === 'admin' ? '/admin/ordenes' : '/valuador/dashboard';
  const isAdmin = user?.rol === 'admin';

  return (
    <Layout>
      <button onClick={() => navigate(backPath)}
        style={{ background: 'transparent', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginBottom: '16px' }}>
        ← Volver
      </button>

      <div style={{ background: '#fff', padding: '28px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: '0 0 20px', color: '#1e293b' }}>Detalle de orden</h2>
        <div style={{ display: 'grid', gap: '14px' }}>
          <Row label="Inmueble" value={orden.inmueble?.direccion} />
          <Row label="Tipo" value={orden.inmueble?.tipo} />
          <Row label="Valuador" value={orden.valuadorAsignado?.nombre || 'Sin asignar'} />
          <Row label="Monto" value={`$${orden.monto?.toLocaleString('es-MX')}`} />
          <Row label="Anticipo (sin IVA)" value={`$${orden.anticipo?.toLocaleString('es-MX')}`} />
          <Row label="Fecha" value={orden.fecha ? new Date(orden.fecha).toLocaleDateString('es-MX') : '—'} />
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '14px', minWidth: '160px' }}>Estatus y anticipo</span>
            <StatusBadge estatus={orden.estatus} pagoAnticipo={orden.pagoAnticipo} anticipoUrl={orden.anticipoUrl} />
          </div>
        </div>

        {isAdmin && (
          <div style={{ display: 'flex', gap: '10px', marginTop: '28px', flexWrap: 'wrap' }}>
            <button onClick={() => { setErrorMsg(''); setNuevoEstatus(orden.estatus); setShowEstatus(true); }}
              style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer' }}>
              Cambiar estatus
            </button>
            <button onClick={openValuadorModal}
              style={{ background: '#0ea5e9', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer' }}>
              {orden.valuadorAsignado ? 'Reasignar valuador' : 'Asignar valuador'}
            </button>
          </div>
        )}
      </div>

      {/* Modal: cambiar estatus */}
      {showEstatus && (
        <div style={modalStyle} onClick={() => setShowEstatus(false)}>
          <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 20px', color: '#1e293b' }}>Cambiar estatus</h3>
            <form onSubmit={handleCambioEstatus} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Nuevo estatus</label>
                <select style={inputStyle} value={nuevoEstatus}
                  onChange={(e) => setNuevoEstatus(e.target.value)}>
                  {ESTATUS.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>
              {errorMsg && <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{errorMsg}</p>}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowEstatus(false)}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={savingEstatus}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#6366f1', color: '#fff', cursor: 'pointer' }}>
                  {savingEstatus ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: asignar valuador */}
      {showValuador && (
        <div style={modalStyle} onClick={() => setShowValuador(false)}>
          <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 20px', color: '#1e293b' }}>Asignar valuador</h3>
            <form onSubmit={handleAsignarValuador} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Valuador *</label>
                <select style={inputStyle} value={valuadorId}
                  onChange={(e) => setValuadorId(e.target.value)}>
                  <option value="">— Selecciona un valuador —</option>
                  {valuadores.map((v) => (
                    <option key={v._id} value={v._id}>{v.nombre} ({v.email})</option>
                  ))}
                </select>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                Al asignar valuador el estatus cambiará a <strong>en proceso</strong> automáticamente.
              </p>
              {errorMsg && <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{errorMsg}</p>}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowValuador(false)}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={savingValuador}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#0ea5e9', color: '#fff', cursor: 'pointer' }}>
                  {savingValuador ? 'Asignando...' : 'Asignar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <span style={{ color: '#64748b', fontSize: '14px', minWidth: '160px' }}>{label}</span>
      <span style={{ color: '#1e293b', fontSize: '14px', fontWeight: 500 }}>{value || '—'}</span>
    </div>
  );
}

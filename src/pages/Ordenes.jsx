import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { getOrdenes } from '../services/ordenesService';
import apiClient from '../services/apiClient';

const columns = [
  { key: 'inmueble', label: 'Inmueble', render: (v) => v?.direccion || '—' },
  { key: 'valuadorAsignado', label: 'Valuador', render: (v) => v?.nombre || 'Sin asignar' },
  { key: 'monto', label: 'Monto', render: (v) => `$${v?.toLocaleString('es-MX')}` },
  { key: 'estatus', label: 'Estatus', render: (v, row) => <StatusBadge estatus={v} pagoAnticipo={row.pagoAnticipo} anticipoUrl={row.anticipoUrl} /> },
];

const modalStyle = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
};
const cardStyle = {
  background: '#fff', borderRadius: '12px', padding: '28px',
  width: '440px', maxWidth: '90vw', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
};
const inputStyle = {
  width: '100%', padding: '8px 12px', borderRadius: '6px',
  border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box',
};
const labelStyle = { fontSize: '13px', color: '#475569', marginBottom: '4px', display: 'block' };

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [inmuebles, setInmuebles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ inmueble: '', monto: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const load = () => {
    Promise.all([
      getOrdenes(),
      apiClient.get('/inmuebles'),
    ]).then(([ords, inmRes]) => {
      setOrdenes(ords);
      setInmuebles(inmRes.data.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  function openModal() {
    setForm({ inmueble: '', monto: '' });
    setError('');
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.inmueble || !form.monto) {
      setError('Todos los campos son obligatorios');
      return;
    }
    setSaving(true);
    try {
      await apiClient.post('/ordenes', { inmueble: form.inmueble, monto: Number(form.monto) });
      setShowModal(false);
      load();
    } catch (e) {
      setError(e.response?.data?.error?.message || 'Error al crear orden');
    } finally {
      setSaving(false);
    }
  }

  const anticipo = form.monto ? Math.floor(Number(form.monto) / 1.16 * 0.5).toLocaleString('es-MX') : null;

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Órdenes de servicio</h2>
        <button onClick={openModal} style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
          + Nueva orden
        </button>
      </div>

      {loading ? <p>Cargando...</p> : (
        <DataTable columns={columns} data={ordenes} onRowClick={(o) => navigate(`/admin/ordenes/${o._id}`)} />
      )}

      {showModal && (
        <div style={modalStyle} onClick={() => setShowModal(false)}>
          <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 20px', color: '#1e293b' }}>Nueva orden de servicio</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Inmueble *</label>
                <select style={inputStyle} value={form.inmueble}
                  onChange={(e) => setForm({ ...form, inmueble: e.target.value })}>
                  <option value="">— Selecciona un inmueble —</option>
                  {inmuebles.map((i) => (
                    <option key={i._id} value={i._id}>
                      {i.direccion} ({i.tipo}) — {i.cliente?.nombre || 'Sin cliente'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Monto total (con IVA) *</label>
                <input style={inputStyle} type="number" value={form.monto}
                  onChange={(e) => setForm({ ...form, monto: e.target.value })}
                  placeholder="Ej: 116000" min="1" />
              </div>
              {anticipo && (
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '6px', padding: '10px 14px', fontSize: '13px', color: '#166534' }}>
                  Anticipo calculado (50% sin IVA): <strong>${anticipo}</strong>
                </div>
              )}
              {error && <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{error}</p>}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#6366f1', color: '#fff', cursor: 'pointer' }}>
                  {saving ? 'Creando orden...' : 'Crear orden'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

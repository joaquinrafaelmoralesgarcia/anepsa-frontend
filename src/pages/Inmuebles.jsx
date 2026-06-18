import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import apiClient from '../services/apiClient';

const columns = [
  { key: 'direccion', label: 'Dirección' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'metrosCuadrados', label: 'm²' },
  { key: 'cliente', label: 'Cliente', render: (v) => v?.nombre || '—' },
];

const modalStyle = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
};
const cardStyle = {
  background: '#fff', borderRadius: '12px', padding: '28px',
  width: '420px', maxWidth: '90vw', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
};
const inputStyle = {
  width: '100%', padding: '8px 12px', borderRadius: '6px',
  border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box',
};
const labelStyle = { fontSize: '13px', color: '#475569', marginBottom: '4px', display: 'block' };

export default function Inmuebles() {
  const [inmuebles, setInmuebles] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ direccion: '', tipo: 'casa', metrosCuadrados: '', cliente: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    Promise.all([
      apiClient.get('/inmuebles'),
      apiClient.get('/clientes'),
    ]).then(([inmRes, clRes]) => {
      setInmuebles(inmRes.data.data);
      setClientes(clRes.data.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  function openModal() {
    setForm({ direccion: '', tipo: 'casa', metrosCuadrados: '', cliente: '' });
    setError('');
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.direccion || !form.metrosCuadrados || !form.cliente) {
      setError('Todos los campos son obligatorios');
      return;
    }
    setSaving(true);
    try {
      await apiClient.post('/inmuebles', {
        direccion: form.direccion,
        tipo: form.tipo,
        metrosCuadrados: Number(form.metrosCuadrados),
        cliente: form.cliente,
      });
      setShowModal(false);
      load();
    } catch (e) {
      setError(e.response?.data?.error?.message || 'Error al crear inmueble');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Inmuebles</h2>
        <button onClick={openModal} style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
          + Nuevo inmueble
        </button>
      </div>

      {loading ? <p>Cargando...</p> : <DataTable columns={columns} data={inmuebles} />}

      {showModal && (
        <div style={modalStyle} onClick={() => setShowModal(false)}>
          <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 20px', color: '#1e293b' }}>Nuevo inmueble</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Dirección *</label>
                <input style={inputStyle} value={form.direccion}
                  onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                  placeholder="Ej: Av. Insurgentes 200, CDMX" />
              </div>
              <div>
                <label style={labelStyle}>Tipo *</label>
                <select style={inputStyle} value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
                  <option value="casa">Casa</option>
                  <option value="local">Local</option>
                  <option value="terreno">Terreno</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Metros cuadrados *</label>
                <input style={inputStyle} type="number" value={form.metrosCuadrados}
                  onChange={(e) => setForm({ ...form, metrosCuadrados: e.target.value })}
                  placeholder="Ej: 150" min="1" />
              </div>
              <div>
                <label style={labelStyle}>Cliente *</label>
                <select style={inputStyle} value={form.cliente}
                  onChange={(e) => setForm({ ...form, cliente: e.target.value })}>
                  <option value="">— Selecciona un cliente —</option>
                  {clientes.map((c) => (
                    <option key={c._id} value={c._id}>{c.nombre} ({c.RFC})</option>
                  ))}
                </select>
              </div>
              {error && <p style={{ color: '#ef4444', fontSize: '13px', margin: 0 }}>{error}</p>}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#6366f1', color: '#fff', cursor: 'pointer' }}>
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

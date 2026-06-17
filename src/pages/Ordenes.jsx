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

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getOrdenes().then(setOrdenes).finally(() => setLoading(false));
  }, []);

  async function handleCreate() {
    const inmuebleId = prompt('ID del inmueble:');
    const monto = prompt('Monto total (con IVA):');
    if (!inmuebleId || !monto) return;
    try {
      await apiClient.post('/ordenes', { inmueble: inmuebleId, monto: Number(monto) });
      getOrdenes().then(setOrdenes);
    } catch (e) {
      alert(e.response?.data?.error?.message || 'Error al crear orden');
    }
  }

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Órdenes de servicio</h2>
        <button onClick={handleCreate} style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
          + Nueva orden
        </button>
      </div>
      {loading ? <p>Cargando...</p> : (
        <DataTable columns={columns} data={ordenes} onRowClick={(o) => navigate(`/admin/ordenes/${o._id}`)} />
      )}
    </Layout>
  );
}

import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { getOrdenes } from '../services/ordenesService';

const columns = [
  { key: 'inmueble', label: 'Inmueble', render: (v) => v?.direccion || '—' },
  { key: 'monto', label: 'Monto', render: (v) => `$${v?.toLocaleString('es-MX')}` },
  { key: 'estatus', label: 'Estatus', render: (v, row) => <StatusBadge estatus={v} pagoAnticipo={row.pagoAnticipo} anticipoUrl={row.anticipoUrl} /> },
  { key: 'fecha', label: 'Fecha', render: (v) => v ? new Date(v).toLocaleDateString('es-MX') : '—' },
];

export default function DashboardValuador() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrdenes()
      .then(setOrdenes)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <h2 style={{ color: '#1e293b', marginBottom: '24px' }}>Mis Órdenes</h2>
      {loading ? <p>Cargando...</p> : <DataTable columns={columns} data={ordenes} />}
    </Layout>
  );
}

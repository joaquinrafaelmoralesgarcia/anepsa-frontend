import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
import { getOrdenes } from '../services/ordenesService';

const columns = [
  { key: 'inmueble', label: 'Inmueble', render: (v) => v?.direccion || '—' },
  { key: 'valuadorAsignado', label: 'Valuador', render: (v) => v?.nombre || 'Sin asignar' },
  { key: 'monto', label: 'Monto', render: (v) => `$${v?.toLocaleString('es-MX')}` },
  { key: 'estatus', label: 'Estatus', render: (v, row) => <StatusBadge estatus={v} pagoAnticipo={row.pagoAnticipo} anticipoUrl={row.anticipoUrl} /> },
  { key: 'fecha', label: 'Fecha', render: (v) => v ? new Date(v).toLocaleDateString('es-MX') : '—' },
];

export default function DashboardAdmin() {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrdenes()
      .then(setOrdenes)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <h2 style={{ color: '#1e293b', marginBottom: '24px' }}>Dashboard Admin</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Total órdenes</p>
          <p style={{ fontSize: '32px', fontWeight: 700, color: '#1e293b', margin: '4px 0 0' }}>{ordenes.length}</p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>Anticipos pagados</p>
          <p style={{ fontSize: '32px', fontWeight: 700, color: '#10b981', margin: '4px 0 0' }}>{ordenes.filter((o) => o.pagoAnticipo).length}</p>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>En proceso</p>
          <p style={{ fontSize: '32px', fontWeight: 700, color: '#3b82f6', margin: '4px 0 0' }}>{ordenes.filter((o) => o.estatus === 'en proceso').length}</p>
        </div>
      </div>
      {loading ? <p>Cargando...</p> : <DataTable columns={columns} data={ordenes} />}
    </Layout>
  );
}

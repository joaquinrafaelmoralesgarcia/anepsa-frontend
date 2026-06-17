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

export default function Inmuebles() {
  const [inmuebles, setInmuebles] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => apiClient.get('/inmuebles').then((r) => setInmuebles(r.data.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleCreate() {
    const direccion = prompt('Dirección:');
    const tipo = prompt('Tipo (casa / local / terreno):');
    const metrosCuadrados = prompt('Metros cuadrados:');
    const cliente = prompt('ID del cliente:');
    if (!direccion) return;
    try {
      await apiClient.post('/inmuebles', { direccion, tipo, metrosCuadrados: Number(metrosCuadrados), cliente });
      load();
    } catch (e) {
      alert(e.response?.data?.error?.message || 'Error');
    }
  }

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Inmuebles</h2>
        <button onClick={handleCreate} style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
          + Nuevo inmueble
        </button>
      </div>
      {loading ? <p>Cargando...</p> : <DataTable columns={columns} data={inmuebles} />}
    </Layout>
  );
}

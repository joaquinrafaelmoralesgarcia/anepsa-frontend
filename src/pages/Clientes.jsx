import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import apiClient from '../services/apiClient';

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'RFC', label: 'RFC' },
  { key: 'email', label: 'Email' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'direccion', label: 'Dirección' },
];

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => apiClient.get('/clientes').then((r) => setClientes(r.data.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleCreate() {
    const nombre = prompt('Nombre:');
    const RFC = prompt('RFC:');
    const email = prompt('Email:');
    const telefono = prompt('Teléfono:');
    const direccion = prompt('Dirección:');
    if (!nombre) return;
    try {
      await apiClient.post('/clientes', { nombre, RFC, email, telefono, direccion });
      load();
    } catch (e) {
      alert(e.response?.data?.error?.message || 'Error');
    }
  }

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Clientes</h2>
        <button onClick={handleCreate} style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
          + Nuevo cliente
        </button>
      </div>
      {loading ? <p>Cargando...</p> : <DataTable columns={columns} data={clientes} />}
    </Layout>
  );
}

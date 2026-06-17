import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import DataTable from '../components/DataTable';
import apiClient from '../services/apiClient';

const columns = [
  { key: 'nombre', label: 'Nombre' },
  { key: 'email', label: 'Email' },
  { key: 'rol', label: 'Rol' },
  { key: 'activo', label: 'Activo', render: (v) => v ? '✅' : '❌' },
];

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => apiClient.get('/usuarios').then((r) => setUsuarios(r.data.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  async function handleCreate() {
    const nombre = prompt('Nombre:');
    const email = prompt('Email:');
    const password = prompt('Contraseña:');
    const rol = prompt('Rol (admin / valuador):');
    if (!nombre) return;
    try {
      await apiClient.post('/usuarios', { nombre, email, password, rol });
      load();
    } catch (e) {
      alert(e.response?.data?.error?.message || 'Error');
    }
  }

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Usuarios</h2>
        <button onClick={handleCreate} style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
          + Nuevo usuario
        </button>
      </div>
      {loading ? <p>Cargando...</p> : <DataTable columns={columns} data={usuarios} />}
    </Layout>
  );
}

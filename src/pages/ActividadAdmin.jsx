import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import * as socketService from '../services/socketService';

const EVENTS = ['orden:actualizada', 'orden:asignada', 'anticipo:pagado'];

const labelMap = {
  'orden:actualizada': '🔄 Orden actualizada',
  'orden:asignada': '👤 Orden asignada',
  'anticipo:pagado': '💰 Anticipo pagado',
};

export default function ActividadAdmin() {
  const [actividad, setActividad] = useState([]);

  useEffect(() => {
    const handlers = {};

    EVENTS.forEach((event) => {
      handlers[event] = (data) => {
        setActividad((prev) => [
          { id: Date.now(), event, data, ts: new Date().toLocaleTimeString('es-MX') },
          ...prev.slice(0, 49),
        ]);
      };
      socketService.on(event, handlers[event]);
    });

    return () => {
      EVENTS.forEach((event) => socketService.off(event, handlers[event]));
    };
  }, []);

  return (
    <Layout>
      <h2 style={{ color: '#1e293b', marginBottom: '24px' }}>Panel de actividad en tiempo real</h2>
      {actividad.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>Esperando eventos...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {actividad.map((a) => (
            <div key={a.id} style={{ background: '#fff', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600 }}>{labelMap[a.event] || a.event}</span>
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>{a.ts}</span>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

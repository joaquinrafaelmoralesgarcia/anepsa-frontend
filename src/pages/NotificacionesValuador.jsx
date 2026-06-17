import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import * as socketService from '../services/socketService';

export default function NotificacionesValuador() {
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    function handler(data) {
      setNotificaciones((prev) => [
        { id: Date.now(), data, ts: new Date().toLocaleTimeString('es-MX') },
        ...prev,
      ]);
    }

    socketService.on('orden:actualizada', handler);
    socketService.on('orden:asignada', handler);
    socketService.on('anticipo:pagado', handler);

    return () => {
      socketService.off('orden:actualizada', handler);
      socketService.off('orden:asignada', handler);
      socketService.off('anticipo:pagado', handler);
    };
  }, []);

  return (
    <Layout>
      <h2 style={{ color: '#1e293b', marginBottom: '24px' }}>Mis notificaciones</h2>
      {notificaciones.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>Sin notificaciones recientes</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {notificaciones.map((n) => (
            <div key={n.id} style={{ background: '#fff', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <span>Nueva actualización en tu orden</span>
              <span style={{ color: '#94a3b8', fontSize: '13px', marginLeft: '16px' }}>{n.ts}</span>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

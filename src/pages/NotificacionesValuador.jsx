import { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import { getSocket, isConnected } from '../services/socketService';

const labelMap = {
  'orden:actualizada': 'Orden actualizada',
  'orden:asignada': 'Nueva orden asignada',
  'anticipo:pagado': 'Anticipo pagado',
};

const colorMap = {
  'orden:actualizada': '#6366f1',
  'orden:asignada': '#0ea5e9',
  'anticipo:pagado': '#22c55e',
};

const EVENTOS = ['orden:actualizada', 'orden:asignada', 'anticipo:pagado'];

export default function NotificacionesValuador() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [connected, setConnected] = useState(false);
  const handlersRef = useRef({});

  useEffect(() => {
    const socket = getSocket();

    if (!socket) {
      console.warn('[Notificaciones] Socket no disponible aún');
      return;
    }

    // Actualizar estado de conexión
    setConnected(socket.connected);

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    // Registrar handlers de eventos
    EVENTOS.forEach((evento) => {
      const handler = (data) => {
        console.log('[Notificaciones] Evento recibido:', evento, data);
        setNotificaciones((prev) => [
          {
            id: Date.now() + Math.random(),
            evento,
            orden: data?.orden,
            ts: new Date().toLocaleTimeString('es-MX'),
          },
          ...prev.slice(0, 49),
        ]);
      };
      handlersRef.current[evento] = handler;
      socket.on(evento, handler);
      console.log('[Notificaciones] Escuchando:', evento);
    });

    return () => {
      const s = getSocket();
      if (!s) return;
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      EVENTOS.forEach((evento) => {
        if (handlersRef.current[evento]) {
          s.off(evento, handlersRef.current[evento]);
        }
      });
    };
  }, []);

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Mis notificaciones</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: connected ? '#22c55e' : '#ef4444', display: 'inline-block' }} />
          <span style={{ fontSize: '13px', color: '#64748b' }}>{connected ? 'Conectado' : 'Desconectado'}</span>
          {notificaciones.length > 0 && (
            <button onClick={() => setNotificaciones([])}
              style={{ fontSize: '13px', color: '#64748b', background: 'transparent', border: '1px solid #e2e8f0', padding: '4px 12px', borderRadius: '6px', cursor: 'pointer', marginLeft: '8px' }}>
              Limpiar
            </button>
          )}
        </div>
      </div>

      {notificaciones.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔔</div>
          <p style={{ margin: 0 }}>Sin notificaciones recientes</p>
          <p style={{ margin: '4px 0 0', fontSize: '13px' }}>
            {connected ? 'Esperando eventos en tiempo real...' : 'Sin conexión — intenta recargar la página'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notificaciones.map((n) => (
            <div key={n.id} style={{
              background: '#fff', padding: '16px 20px', borderRadius: '10px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              borderLeft: `4px solid ${colorMap[n.evento] || '#6366f1'}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            }}>
              <div>
                <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>
                  {labelMap[n.evento] || n.evento}
                </p>
                {n.orden && (
                  <p style={{ margin: 0, fontSize: '13px', color: '#475569' }}>
                    {n.orden.inmueble?.direccion && `Inmueble: ${n.orden.inmueble.direccion} · `}
                    Estatus: <strong>{n.orden.estatus}</strong>
                    {n.orden.pagoAnticipo && ' · Anticipo pagado ✅'}
                  </p>
                )}
              </div>
              <span style={{ color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap', marginLeft: '16px' }}>{n.ts}</span>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

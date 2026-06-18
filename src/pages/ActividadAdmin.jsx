import { useEffect, useRef, useState } from 'react';
import Layout from '../components/Layout';
import { getSocket } from '../services/socketService';

const EVENTOS = ['orden:actualizada', 'orden:asignada', 'anticipo:pagado'];

const labelMap = {
  'orden:actualizada': 'Orden actualizada',
  'orden:asignada': 'Orden asignada a valuador',
  'anticipo:pagado': 'Anticipo pagado',
};

const colorMap = {
  'orden:actualizada': '#6366f1',
  'orden:asignada': '#0ea5e9',
  'anticipo:pagado': '#22c55e',
};

export default function ActividadAdmin() {
  const [actividad, setActividad] = useState([]);
  const [connected, setConnected] = useState(false);
  const handlersRef = useRef({});

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    setConnected(socket.connected);
    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    EVENTOS.forEach((evento) => {
      const handler = (data) => {
        setActividad((prev) => [
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
    });

    return () => {
      const s = getSocket();
      if (!s) return;
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      EVENTOS.forEach((evento) => {
        if (handlersRef.current[evento]) s.off(evento, handlersRef.current[evento]);
      });
    };
  }, []);

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ color: '#1e293b', margin: 0 }}>Panel de actividad en tiempo real</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: connected ? '#22c55e' : '#ef4444', display: 'inline-block' }} />
          <span style={{ fontSize: '13px', color: '#64748b' }}>{connected ? 'Conectado' : 'Desconectado'}</span>
          {actividad.length > 0 && (
            <button onClick={() => setActividad([])}
              style={{ fontSize: '13px', color: '#64748b', background: 'transparent', border: '1px solid #e2e8f0', padding: '4px 12px', borderRadius: '6px', marginLeft: '8px', cursor: 'pointer' }}>
              Limpiar
            </button>
          )}
        </div>
      </div>

      {actividad.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📡</div>
          <p style={{ margin: 0 }}>Esperando eventos...</p>
          <p style={{ margin: '4px 0 0', fontSize: '13px' }}>Aquí aparecen todos los cambios de estado en tiempo real</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {actividad.map((a) => (
            <div key={a.id} style={{
              background: '#fff', padding: '16px 20px', borderRadius: '10px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              borderLeft: `4px solid ${colorMap[a.evento] || '#6366f1'}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            }}>
              <div>
                <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>
                  {labelMap[a.evento] || a.evento}
                </p>
                {a.orden && (
                  <p style={{ margin: 0, fontSize: '13px', color: '#475569' }}>
                    {a.orden.inmueble?.direccion && `${a.orden.inmueble.direccion} · `}
                    Estatus: <strong>{a.orden.estatus}</strong>
                    {a.orden.valuadorAsignado?.nombre && ` · Valuador: ${a.orden.valuadorAsignado.nombre}`}
                    {a.orden.pagoAnticipo && ' · Anticipo pagado ✅'}
                  </p>
                )}
              </div>
              <span style={{ color: '#94a3b8', fontSize: '12px', whiteSpace: 'nowrap', marginLeft: '16px' }}>{a.ts}</span>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

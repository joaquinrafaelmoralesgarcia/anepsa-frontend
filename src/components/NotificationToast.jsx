import { useEffect, useState } from 'react';
import * as socketService from '../services/socketService';

const EVENTS = ['orden:actualizada', 'orden:asignada', 'anticipo:pagado'];

const labelMap = {
  'orden:actualizada': 'Orden actualizada',
  'orden:asignada': 'Nueva orden asignada',
  'anticipo:pagado': 'Anticipo pagado',
};

export default function NotificationToast() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const handlers = {};

    EVENTS.forEach((event) => {
      handlers[event] = (data) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, event, data }]);
        setTimeout(() => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 5000);
      };
      socketService.on(event, handlers[event]);
    });

    return () => {
      EVENTS.forEach((event) => socketService.off(event, handlers[event]));
    };
  }, []);

  if (!notifications.length) return null;

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            background: '#1e293b',
            color: '#f8fafc',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            maxWidth: '320px',
            fontSize: '14px',
          }}
        >
          <strong>{labelMap[n.event] || n.event}</strong>
        </div>
      ))}
    </div>
  );
}

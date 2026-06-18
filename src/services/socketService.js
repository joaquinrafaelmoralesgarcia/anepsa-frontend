import { io } from 'socket.io-client';

let socket = null;

export function connect(token) {
  // Desconectar socket previo si existe
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
    query: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('[Socket] Conectado, id:', socket.id);
  });

  socket.on('connect_error', (err) => {
    console.warn('[Socket] Error de conexión:', err.message);
  });

  socket.on('disconnect', (reason) => {
    console.warn('[Socket] Desconectado:', reason);
  });

  return socket;
}

export function on(event, callback) {
  if (!socket) {
    console.warn('[Socket] on() llamado sin socket activo');
    return;
  }
  socket.on(event, callback);
}

export function off(event, callback) {
  if (!socket) return;
  socket.off(event, callback);
}

export function disconnect() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}

export function isConnected() {
  return socket?.connected ?? false;
}

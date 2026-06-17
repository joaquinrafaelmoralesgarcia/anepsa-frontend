import { io } from 'socket.io-client';

let socket = null;

export function connect(token) {
  if (socket?.connected) return socket;

  socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
    query: { token },
    autoConnect: true,
  });

  return socket;
}

export function on(event, callback) {
  socket?.on(event, callback);
}

export function off(event, callback) {
  socket?.off(event, callback);
}

export function disconnect() {
  socket?.disconnect();
  socket = null;
}

export function getSocket() {
  return socket;
}

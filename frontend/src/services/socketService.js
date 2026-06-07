import { io } from 'socket.io-client';
import { API_URL } from '../config';

const SOCKET_URL = API_URL;;

let socket = null;
let currentRoom = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, { 
      transports: ['websocket'],
      reconnection: true,
    });
  }
  return socket;
};

export const joinRoom = (roomCode) => {
  if (currentRoom === roomCode) return;
  currentRoom = roomCode;
  const s = getSocket();
  if (s.connected) {
    s.emit('join-room', roomCode);
  } else {
    s.once('connect', () => {
      s.emit('join-room', roomCode);
    });
  }
};

export const disconnectSocket = () => {
  currentRoom = null;
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
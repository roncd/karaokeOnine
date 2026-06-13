import { io } from 'socket.io-client';
import { API_URL } from '../config';

const SOCKET_URL = API_URL;

let socket = null;
let lastJoinPayload = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
    });

    socket.on('connect', () => {
      if (lastJoinPayload) {
        socket.emit('join-room', lastJoinPayload);
      }
    });
  }
  return socket;
};

export const joinRoom = (roomCode, pseudo, avatarIndex, userId) => {
  lastJoinPayload = { roomCode, pseudo, avatarIndex, userId };
  const s = getSocket();

  if (s.connected) {
    s.emit('join-room', lastJoinPayload);
  } else {
    s.once('connect', () => {
      s.emit('join-room', lastJoinPayload);
    });
  }
};

export const disconnectSocket = () => {
  lastJoinPayload = null;
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

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

export const joinRoom = (roomCode, pseudo = 'Annonyme', avatarIndex = 0) => {
  // if (currentRoom === roomCode) return;
  // currentRoom = roomCode;
  const s = getSocket();
  const payload = { roomCode, pseudo, avatarIndex };
  if (s.connected) {
    s.emit('join-room', payload);
  } else {
    s.once('connect', () => {
      s.emit('join-room', payload);
    });
  }
};

//   if (s.connected) {
//     s.emit('join-room', { roomCode, pseudo, avatarIndex });
//   } else {
//     s.once('connect', () => {
//       s.emit('join-room', { roomCode, pseudo, avatarIndex });
//     });
//   }
// };

export const disconnectSocket = () => {
  currentRoom = null;
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
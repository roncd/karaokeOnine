import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000'; // à changer selon l'env

export function useSocket(roomCode) {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [queue, setQueue] = useState([]);
  const [skipVotes, setSkipVotes] = useState(0);
  const [skippedSong, setSkippedSong] = useState(null);
  const [usersJoined, setUsersJoined] = useState([]);

  useEffect(() => {
    // Initialisation de la connexion
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'], // important pour React Native / Expo
    });

    const socket = socketRef.current;

    // Connexion établie
    socket.on('connect', () => {
      setIsConnected(true);
      if (roomCode) {
        socket.emit('join-room', roomCode);
      }
    });

    // Déconnexion
    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Un utilisateur a rejoint la room
    socket.on('user-joined', ({ userId }) => {
      setUsersJoined((prev) => [...prev, userId]);
    });

    // File d'attente mise à jour
    socket.on('queue-updated', (updatedQueue) => {
      setQueue(updatedQueue);
    });

    // Votes skip mis à jour
    socket.on('skip-updated', ({ votes }) => {
      setSkipVotes(votes);
    });

    // Chanson skippée
    socket.on('song-skipped', ({ skippedSong }) => {
      setSkippedSong(skippedSong);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomCode]);

  // Ajouter une chanson à la file
  const addSong = (songTitle) => {
    if (socketRef.current && roomCode) {
      socketRef.current.emit('add-song', { roomCode, songTitle });
    }
  };

  // Voter pour skipper la chanson actuelle
  const voteSkip = () => {
    if (socketRef.current && roomCode) {
      socketRef.current.emit('vote-skip', { roomCode });
    }
  };

  return {
    isConnected,
    queue,
    skipVotes,
    skippedSong,
    usersJoined,
    addSong,
    voteSkip,
  };
}
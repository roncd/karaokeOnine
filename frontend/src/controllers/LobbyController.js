/**
 * LobbyController.js
 * Gère la logique du salon (file d'attente, votes skip) via socket
 * Reçoit lobbyId et role ('host' | 'guest') depuis la navigation
 */

import React, { useEffect, useRef, useState } from 'react';
import LobbyView from '../views/LobbyView';
import { getSocket, joinRoom, disconnectSocket } from '../services/socketService';
import { clearSession } from '../services/sessionService';

export default function LobbyController({ route, navigation }) {
  const { lobbyId, role } = route.params;
  const socketRef = useRef(null);

  const [isConnected, setIsConnected] = useState(false);
  const [queue, setQueue] = useState([]);
  const [skipVotes, setSkipVotes] = useState(0);
  const [skippedSong, setSkippedSong] = useState(null);
  const [userCount, setUserCount] = useState(1);
  const [toastMessage, setToastMessage] = useState('');
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    // Rejoindre la room
    joinRoom(lobbyId);

    if (socket.connected) {
      setIsConnected(true);
    }

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('user-joined', ({ userId, pseudo, avatarIndex }) => {
      setUserCount((prev) => prev + 1);
      setParticipants(prev => [...prev, { id: userId, pseudo, avatarIndex }]);

    });

    socket.on('countdown-started', ({ currentSong, singerId, songId }) => {
      navigation.replace('Ready', {
        lobbyId,
        role,
        singerId,
        currentSong,
        songId,
      });
    });

    socket.on('queue-updated', (updatedQueue) => {
      setQueue(updatedQueue);
      setSkipVotes(0);
    });

    socket.on('skip-updated', ({ votes }) => {
      setSkipVotes(votes);
    });

    socket.on('song-skipped', ({ skippedSong }) => {
      setSkippedSong(skippedSong);
      setTimeout(() => setSkippedSong(null), 3000);
    });

    socket.on('song-not-found', () => {
      setToastMessage('Veuillez essayer un autre morceau.');
      setTimeout(() => setToastMessage(''), 3000);
    });

    socket.on('connect_error', (err) => {
      console.warn('Erreur socket lobby :', err.message);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('user-joined');
      socket.off('countdown-started');
      socket.off('queue-updated');
      socket.off('skip-updated');
      socket.off('song-skipped');
      socket.off('song-not-found');
      socket.off('connect_error');
    };
  }, [lobbyId]);

  const handleAddSong = (songTitle) => {
    if (!songTitle?.trim()) return;
    socketRef.current?.emit('add-song', {
      roomCode: lobbyId,
      songTitle: songTitle.trim(),
    });
  };

  const handleVoteSkip = () => {
    socketRef.current?.emit('vote-skip', { roomCode: lobbyId });
  };

  const handleStartSong = () => {
    if (queue.length === 0) return;
    socketRef.current?.emit('start-countdown', { roomCode: lobbyId });
  };

  const handleDeleteSong = (index) => {
    socketRef.current?.emit('remove-song', { roomCode: lobbyId, index });
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    socketRef.current?.emit('move-song', { roomCode: lobbyId, from: index, to: index - 1 });
  };

  const handleMoveDown = (index) => {
    if (index === queue.length - 1) return;
    socketRef.current?.emit('move-song', { roomCode: lobbyId, from: index, to: index + 1 });
  };

  const handleLeave = async () => {
    await clearSession();
    disconnectSocket();
    navigation.navigate('Home');
  };

  return (
    <LobbyView
      lobbyId={lobbyId}
      role={role}
      isConnected={isConnected}
      queue={queue}
      skipVotes={skipVotes}
      skippedSong={skippedSong}
      userCount={userCount}
      toastMessage={toastMessage}
      onAddSong={handleAddSong}
      onVoteSkip={handleVoteSkip}
      onLeave={handleLeave}
      onStartSong={handleStartSong}
    />
  );
}
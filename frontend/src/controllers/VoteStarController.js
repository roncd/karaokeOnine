import React, { useEffect, useRef, useState } from 'react';
import VoteStarView from '../views/VoteStarView';
import { getSocket, disconnectSocket } from '../services/socketService';

export default function VoteStarController({ route, navigation }) {
  const { lobbyId, role, hostId, pseudo, avatarIndex: avatarIndexParam } = route.params;

  const socketRef = useRef(null);
  const [participants, setParticipants] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [winner, setWinner] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const avatarIndexRef = useRef(avatarIndexParam ?? 0);

  useEffect(() => {
    if (avatarIndexParam !== undefined) {
      avatarIndexRef.current = avatarIndexParam;
    }
  }, [avatarIndexParam]);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    if (socket.connected) {
      socket.emit('get-participants', { roomCode: lobbyId });
    }

    socket.on('connect', () => {
      socket.emit('get-participants', { roomCode: lobbyId });
    });

    socket.on('participants-list', (data) => {
      const list = Array.isArray(data) ? data : data?.participants ?? [];
      setParticipants(list);
    });

    socket.on('user-joined', ({ userId, pseudo, avatarIndex }) => {
      setParticipants((prev) =>
        prev.some(p => p.id === userId) ? prev : [...prev, { id: userId, pseudo, avatarIndex }]
      );
    });

    socket.on('vote-result', ({ winnerId, votes }) => {
      setWinner({ id: winnerId, votes });
    });

    socket.on('connect_error', (err) => {
      console.warn('Erreur socket vote star :', err.message);
    });

    return () => {
      socket.off('connect');
      socket.off('participants-list');
      socket.off('user-joined');
      socket.off('vote-result');
      socket.off('connect_error');
    };
  }, [lobbyId]);

  const handleSelect = (userId) => {
    if (hasVoted) return;
    setSelectedId(userId);
  };

  const handleConfirm = () => {
    if (!selectedId || hasVoted) return;
    setHasVoted(true);
    socketRef.current?.emit('vote-star', {
      roomCode: lobbyId,
      votedFor: selectedId,
    });
  };

  const handleContinue = () => {
    disconnectSocket();
    navigation.replace('Lobby', { lobbyId, role });
  };

  return (
    <VoteStarView
      participants={participants}
      selectedId={selectedId}
      winner={winner}
      hasVoted={hasVoted}
      hostId={hostId}
      onSelect={handleSelect}
      onConfirm={handleConfirm}
      onContinue={handleContinue}
    />
  );
}
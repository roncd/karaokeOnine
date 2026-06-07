import React, { useEffect, useRef, useState } from 'react';
import VoteStarView from '../views/VoteStarView';
import { getSocket, joinRoom, disconnectSocket } from '../services/socketService';

export default function VoteStarController({ route, navigation }) {
  const { lobbyId, role, hostId } = route.params;

  const socketRef                       = useRef(null);
  const [participants, setParticipants] = useState([]);
  const [selectedId, setSelectedId]     = useState(null);
  const [winner, setWinner]             = useState(null);
  const [hasVoted, setHasVoted]         = useState(false);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    joinRoom(lobbyId);

    if (socket.connected) {
      socket.emit('get-participants', { roomCode: lobbyId });
    }

    socket.on('connect', () => {
      socket.emit('get-participants', { roomCode: lobbyId });
    });

    socket.on('participants-list', ({ participants }) => {
      setParticipants(participants);
    });

    socket.on('user-joined', ({ userId }) => {
      setParticipants((prev) =>
        prev.includes(userId) ? prev : [...prev, userId]
      );
    });

    socket.on('vote-result', ({ winnerId, votes }) => {
      setWinner({ id: winnerId, votes });
    });

    return () => {
      socket.off('connect');
      socket.off('participants-list');
      socket.off('user-joined');
      socket.off('vote-result');
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
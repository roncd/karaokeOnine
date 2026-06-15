/**
 * LobbyController.js
 * Gère la logique du salon (file d'attente, votes skip) via socket
 * Reçoit lobbyId et role ('host' | 'guest') depuis la navigation
 */

import React, { useEffect, useRef, useState } from 'react';
import LobbyView from '../views/LobbyView';
import { getSocket, disconnectSocket, joinRoom } from '../services/socketService';
import { clearSession, saveSession } from '../services/sessionService';
import {
  connectToRoom,
  disconnectFromRoom,
  toggleMicrophone,
  activateLobbyAudio,
  isMicEnabled,
  isAudioUnlocked,
  isRoomConnected,
} from '../services/livekitService';
import { useToast } from '../hooks/useToast';

export default function LobbyController({ route, navigation }) {
  const { lobbyId, role, pseudo, avatarIndex: avatarIndexParam, userId } = route.params;
  const socketRef = useRef(null);

  const [isConnected, setIsConnected] = useState(false);
  const [queue, setQueue] = useState([]);
  const [skipVotes, setSkipVotes] = useState(0);
  const [userCount, setUserCount] = useState(1);
  const { toast, showToast } = useToast();
  const avatarIndexRef = useRef(avatarIndexParam ?? 0);
  const [micEnabled, setMicEnabled] = useState(false);
  const [audioActive, setAudioActive] = useState(isAudioUnlocked());
  const [livekitReady, setLivekitReady] = useState(isRoomConnected());
  const [activatingAudio, setActivatingAudio] = useState(false);

  useEffect(() => {
    if (avatarIndexParam !== undefined) {
      avatarIndexRef.current = avatarIndexParam;
    }
  }, [avatarIndexParam]);

  useEffect(() => {
    if (!lobbyId || !pseudo || userId == null) return undefined;

    joinRoom(lobbyId, pseudo, avatarIndexRef.current, userId);
    saveSession({
      lobbyId,
      role,
      pseudo,
      avatarIndex: avatarIndexRef.current,
      userId,
    });
  }, [lobbyId, pseudo, userId, role]);

  useEffect(() => {
    if (!userId) return undefined;

    let cancelled = false;

    const setupLivekit = async () => {
      const connected = await connectToRoom(lobbyId, userId);
      if (cancelled) return;

      setLivekitReady(Boolean(connected));

      if (isAudioUnlocked()) {
        setAudioActive(true);
        setMicEnabled(isMicEnabled());
      }
    };

    setupLivekit();

    return () => {
      cancelled = true;
    };
  }, [lobbyId, userId]);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    if (socket.connected) {
      setIsConnected(true);
    }

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('user-joined', () => {
      setUserCount((prev) => prev + 1);
    });

    socket.on('countdown-started', ({ currentSong, singerId, songId, singerPseudo, singerAvatarIndex }) => {
      navigation.replace('Ready', {
        lobbyId,
        role,
        singerId,
        singerPseudo,
        singerAvatarIndex,
        currentSong,
        songId,
        userId,
        pseudo,
        avatarIndex: avatarIndexRef.current,
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
      const titre = typeof skippedSong === 'string' ? skippedSong : skippedSong?.titre;
      showToast('songSkipped', {
        subtitle: titre
          ? `« ${titre} » a été passé.`
          : 'Le morceau a été passé.',
      });
    });

    socket.on('song-added', ({ titre }) => {
      showToast('songAdded', {
        subtitle: titre
          ? `« ${titre} » a été ajouté à la file d'attente.`
          : undefined,
      });
    });

    socket.on('song-not-found', () => {
      showToast('songNotFound');
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
      socket.off('song-added');
      socket.off('song-not-found');
      socket.off('connect_error');
    };
  }, [lobbyId, navigation, role, userId, pseudo, showToast]);

  const handleAddSong = (songTitle) => {
    socketRef.current?.emit('add-song', {
      roomCode: lobbyId,
      songTitle: songTitle.trim(),
      pseudo,
      avatarIndex: avatarIndexRef.current,
    });
  };

  const handleVoteSkip = () => {
    socketRef.current?.emit('vote-skip', { roomCode: lobbyId });
    showToast('skipVote');
  };

  const handleStartSong = () => {
    if (queue.length === 0) return;
    socketRef.current?.emit('start-countdown', { roomCode: lobbyId });
  };

  const handleDeleteSong = (index) => {
    socketRef.current?.emit('remove-song', { roomCode: lobbyId, index });
    showToast('songDeleted');
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
    disconnectFromRoom();
    await clearSession();
    disconnectSocket();
    navigation.navigate('Home');
  };

  const handleActivateAudio = async () => {
    if (activatingAudio || audioActive) return;

    setActivatingAudio(true);
    try {
      if (!livekitReady) {
        const connected = await connectToRoom(lobbyId, userId);
        setLivekitReady(Boolean(connected));
        if (!connected) return;
      }

      const { audio, mic } = await activateLobbyAudio();
      if (audio) {
        setAudioActive(true);
        setMicEnabled(Boolean(mic));
      }
    } finally {
      setActivatingAudio(false);
    }
  };

  const handleToggleMic = async () => {
    if (!audioActive) return;

    const newState = await toggleMicrophone();
    setMicEnabled(Boolean(newState));
  };

  return (
    <LobbyView
      lobbyId={lobbyId}
      role={role}
      isConnected={isConnected}
      queue={queue}
      skipVotes={skipVotes}
      userCount={userCount}
      toast={toast}
      onAddSong={handleAddSong}
      onVoteSkip={handleVoteSkip}
      onLeave={handleLeave}
      onStartSong={handleStartSong}
      onDeleteSong={handleDeleteSong}
      onMoveUp={handleMoveUp}
      onMoveDown={handleMoveDown}
      micEnabled={micEnabled}
      audioActive={audioActive}
      livekitReady={livekitReady}
      activatingAudio={activatingAudio}
      onActivateAudio={handleActivateAudio}
      onToggleMic={handleToggleMic}
    />
  );
}

/**
 * ReadyController.js
 * Gère le compte à rebours avant de chanter
 */

import React, { useEffect, useRef, useState } from 'react';
import ReadyView from '../views/ReadyView';
import { getSocket, joinRoom } from '../services/socketService';
import {
  connectToRoom,
  applySingerMicPolicy,
  enableLobbyMicrophones,
} from '../services/livekitService';

const COUNTDOWN = 10;

const sameUser = (a, b) => String(a) === String(b);

export default function ReadyController({ route, navigation }) {
  const {
    lobbyId,
    role,
    currentSong,
    singerId,
    singerPseudo,
    singerAvatarIndex,
    songId,
    pseudo,
    avatarIndex: avatarIndexParam,
    userId,
  } = route.params;

  const socketRef = useRef(null);
  const timerRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN);
  const [skipped, setSkipped] = useState(false);
  const avatarIndexRef = useRef(avatarIndexParam ?? 0);
  const isSinger = sameUser(singerId, userId);

  useEffect(() => {
    if (avatarIndexParam !== undefined) {
      avatarIndexRef.current = avatarIndexParam;
    }
  }, [avatarIndexParam]);

  useEffect(() => {
    if (!lobbyId || !pseudo || userId == null) return undefined;

    joinRoom(lobbyId, pseudo, avatarIndexRef.current, userId);
  }, [lobbyId, pseudo, userId]);

  useEffect(() => {
    if (!userId) return undefined;

    const setup = async () => {
      await connectToRoom(lobbyId, userId);
      await applySingerMicPolicy(singerId, userId);
    };

    setup();
  }, [lobbyId, singerId, userId]);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    socket.on('singer-ready', ({ singerId: readySingerId, currentSong: song, songId: id }) => {
      clearInterval(timerRef.current);
      navigation.replace('Lyrics', {
        lobbyId,
        role,
        currentSong: typeof song === 'string' ? song : song?.titre ?? currentSong,
        singerId: readySingerId,
        songId: id ?? songId,
        userId,
        pseudo,
        avatarIndex: avatarIndexRef.current,
      });
    });

    socket.on('turn-skipped', async () => {
      clearInterval(timerRef.current);
      setSkipped(true);
      await enableLobbyMicrophones();
      setTimeout(() => {
        navigation.replace('Lobby', {
          lobbyId,
          role,
          pseudo,
          avatarIndex: avatarIndexRef.current,
          userId,
        });
      }, 2000);
    });

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      socket.off('singer-ready');
      socket.off('turn-skipped');
    };
  }, [lobbyId, navigation, role, pseudo, userId, currentSong, songId]);

  const handleReady = () => {
    if (!isSinger || skipped) return;
    socketRef.current?.emit('player-ready', { roomCode: lobbyId });
  };

  return (
    <ReadyView
      isSinger={isSinger}
      singerPseudo={singerPseudo}
      singerAvatarIndex={singerAvatarIndex}
      currentSong={currentSong}
      timeLeft={timeLeft}
      total={COUNTDOWN}
      skipped={skipped}
      onReady={handleReady}
      singerId={singerId}
    />
  );
}

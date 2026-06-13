/**
 * ReadyController.js
 * Gère le compte à rebours avant de chanter
 * Reçoit : lobbyId, role, singerId, currentSong, songId depuis la navigation
 */

import React, { useEffect, useRef, useState } from 'react';
import ReadyView from '../views/ReadyView';
import { getSocket } from '../services/socketService';
import { enableMicrophone, disableMicrophone, getRoom } from '../services/livekitService';

const COUNTDOWN = 10;

export default function ReadyController({ route, navigation }) {
  const { lobbyId, role, currentSong, singerId, songId, pseudo, avatarIndex: avatarIndexParam, userId } = route.params;

  const socketRef = useRef(null);
  const timerRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN);
  const [skipped, setSkipped] = useState(false);
  const [isSinger, setIsSinger] = useState(false);
  const avatarIndexRef = useRef(avatarIndexParam ?? 0);

  useEffect(() => {
    const room = getRoom();

    if (!room) {
      console.log("LiveKit pas encore prêt, on attend…");
      const interval = setInterval(() => {
        const r = getRoom();
        if (r && r.state === "connected") {
          clearInterval(interval);
          if (singerId === userId) enableMicrophone();
          else disableMicrophone();
        }
      }, 200);
      return;
    }

    if (singerId === userId) enableMicrophone();
    else disableMicrophone();
  }, [singerId, userId]);

  useEffect(() => {
    if (avatarIndexParam !== undefined) {
      avatarIndexRef.current = avatarIndexParam;
    }
  }, [avatarIndexParam]);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;
    socket.on('connect', () => {
      console.log('Nouveau socket.id après reconnexion:', socket.id);
    });

    console.log('socket.id:', socket.id);
    console.log('singerId reçu:', singerId);

    // Le chanteur est prêt tout le monde va sur Lyrics
    socket.on('singer-ready', ({ singerId: readySingerId, currentSong, songId }) => {
      clearInterval(timerRef.current);
      navigation.replace('Lyrics', {
        lobbyId,
        role,
        currentSong,
        singerId: readySingerId,
        songId,
        userId,
      });
    });

    // Tour skippé (timeout) retour au lobby
    socket.on('turn-skipped', () => {
      clearInterval(timerRef.current);
      setSkipped(true);
      setTimeout(() => {
        navigation.replace('Lobby', { lobbyId, role,  pseudo, avatarIndex: avatarIndexRef.current, userId, });
      }, 2000);
    });

    // Compte à rebours local
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
      socket.off('connect');
      socket.off('singer-ready');
      socket.off('turn-skipped');
    };
  }, [lobbyId]);

  const handleReady = () => {
    socketRef.current?.emit('player-ready', { roomCode: lobbyId });
  };

  return (
    <ReadyView
      isSinger={isSinger}
      currentSong={currentSong}
      timeLeft={timeLeft}
      total={COUNTDOWN}
      skipped={skipped}
      onReady={handleReady}
      singerId={singerId}
    />
  );
}
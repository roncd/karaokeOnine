/**
 * LyricsController.js
 * Gère la lecture audio, la synchronisation des paroles et les réactions
 */

import React, { useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import LyricsView from '../views/LyricsView';
import { getSocket, joinRoom } from '../services/socketService';

const API_URL = 'http://localhost:3000/api';

// ─── Parser .lrc ─────────────────────────────────────────────────────────────
function parseLrc(lrcContent) {
  const lines = lrcContent.split('\n');
  const result = [];
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

  for (const line of lines) {
    const match = timeRegex.exec(line);
    if (!match) continue;
    const minutes = parseInt(match[1]);
    const seconds = parseInt(match[2]);
    const ms      = parseInt(match[3].padEnd(3, '0'));
    const timeMs  = (minutes * 60 + seconds) * 1000 + ms;
    const text    = line.replace(timeRegex, '').trim();
    if (text) result.push({ timeMs, text });
  }

  return result.sort((a, b) => a.timeMs - b.timeMs);
}

export default function LyricsController({ route, navigation }) {
  const { lobbyId, role, currentSong, singerId, songId } = route.params;

  const socketRef    = useRef(null);
  const soundRef     = useRef(null);
  const intervalRef  = useRef(null);
  const hasNavigated = useRef(false);
  const lyricsRef    = useRef([]);

  const [lyrics, setLyrics]                     = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [reactions, setReactions]               = useState([]);
  const [queue, setQueue]                       = useState([]);
  const [participants, setParticipants]         = useState([]);
  const [scrollRef, setScrollRef]               = useState(null);

  // ─── Charger paroles + audio ──────────────────────────────────────────────
  useEffect(() => {
    const loadSong = async () => {
      try {
        // Charger les paroles
        const lyricsRes  = await fetch(`${API_URL}/songs/${songId}/lyrics`);
        const lyricsData = await lyricsRes.json();
        const parsed     = parseLrc(lyricsData.lyrics);
        setLyrics(parsed);
        lyricsRef.current = parsed;

        // Charger l'audio
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.loadAsync(
          { uri: `${API_URL}/songs/${songId}/audio` },
          { shouldPlay: true }
        );
        soundRef.current = sound;

        // Sync paroles avec la position audio
        intervalRef.current = setInterval(async () => {
          if (!soundRef.current) return;
          const status = await soundRef.current.getStatusAsync();
          if (!status.isLoaded) return;

          const positionMs = status.positionMillis;
          const arr = lyricsRef.current;

          let idx = 0;
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].timeMs <= positionMs) idx = i;
            else break;
          }
          setCurrentLineIndex(idx);

          // Fin de la chanson
          if (status.didJustFinish && !hasNavigated.current) {
            hasNavigated.current = true;
            clearInterval(intervalRef.current);
            navigation.replace('VoteStar', { lobbyId, role, hostId: singerId });
          }
        }, 200);

      } catch (err) {
        console.warn('Erreur chargement chanson :', err.message);
      }
    };

    if (songId) loadSong();

    return () => {
      clearInterval(intervalRef.current);
      soundRef.current?.unloadAsync();
    };
  }, [songId]);

  // Sync lyricsRef avec lyrics
  useEffect(() => {
    lyricsRef.current = lyrics;
  }, [lyrics]);

  // Scroll automatique vers la ligne courante
  useEffect(() => {
    if (scrollRef && currentLineIndex > 2) {
      scrollRef.scrollTo({
        y: currentLineIndex * 40,
        animated: true,
      });
    }
  }, [currentLineIndex]);

  // ─── Socket ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    joinRoom(lobbyId);

    socket.on('connect', () => joinRoom(lobbyId));

    socket.on('queue-updated', (updatedQueue) => setQueue(updatedQueue));

    socket.on('reaction-received', ({ type, userId }) => {
      const id = Date.now();
      setReactions((prev) => [...prev, { id, type, userId }]);
      setTimeout(() => {
        setReactions((prev) => prev.filter((r) => r.id !== id));
      }, 2000);
    });

    socket.on('user-joined', ({ userId }) => {
      setParticipants((prev) => [...prev, userId]);
    });

    return () => {
      socket.off('connect');
      socket.off('queue-updated');
      socket.off('reaction-received');
      socket.off('user-joined');
    };
  }, [lobbyId]);

  const handleReaction = (type) => {
    socketRef.current?.emit('send-reaction', { roomCode: lobbyId, type });
  };

  const handleOpenQueue = () => {
    navigation.navigate('Lobby', { lobbyId, role });
  };

  return (
    <LyricsView
      lyrics={lyrics}
      currentLineIndex={currentLineIndex}
      currentSong={currentSong}
      queue={queue}
      reactions={reactions}
      participants={participants}
      role={role}
      onReaction={handleReaction}
      onOpenQueue={handleOpenQueue}
      onScrollRef={setScrollRef}
    />
  );
}
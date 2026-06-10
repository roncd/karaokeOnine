/**
 * LyricsController.js
 * Gère la lecture audio, la synchronisation des paroles et les réactions
 */

import React, { useEffect, useRef, useState } from 'react';
import LyricsView from '../views/LyricsView';
import { Audio } from 'expo-av';
import { getSocket, joinRoom } from '../services/socketService';
import { API_URL } from '../config';


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
    const ms = parseInt(match[3].padEnd(3, '0'));
    const timeMs = (minutes * 60 + seconds) * 1000 + ms;
    const text = line.replace(timeRegex, '').trim();
    if (text) result.push({ timeMs, text });
  }

  return result.sort((a, b) => a.timeMs - b.timeMs);
}

export default function LyricsController({ route, navigation }) {
  const { lobbyId, role, currentSong, singerId, songId } = route.params;

  const socketRef = useRef(null);
  const intervalRef = useRef(null);
  const hasNavigated = useRef(false);

  const [lyrics, setLyrics] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [reactions, setReactions] = useState([]);
  const [queue, setQueue] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [audioUri, setAudioUri] = useState(null);
  const [scrollRef, setScrollRef] = useState(null);

  // ─── Lecteur audio ────────────────────────────────────────────────────────
  const soundRef = useRef(null);
  const lyricsRef = useRef([]);

  // ─── Charger paroles + audio ──────────────────────────────────────────────
  useEffect(() => {
    const loadSong = async () => {
      try {
        const lyricsRes = await fetch(`${API_URL}/api/songs/${songId}/lyrics`);
        const lyricsData = await lyricsRes.json();
        const parsed = parseLrc(lyricsData.lyrics);
        setLyrics(parsed);
        lyricsRef.current = parsed;

        // Sync paroles avec position audio
        intervalRef.current = setInterval(async () => {
          const status = await soundRef.current?.getStatusAsync();
          if (!status?.isLoaded) return;

          const positionMs = status.positionMillis;
          const arr = lyricsRef.current;

          let idx = 0;
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].timeMs <= positionMs) idx = i;
            else break;
          }
          setCurrentLineIndex(idx);
        }, 200);

        setAudioUri(`${API_URL}/api/songs/${songId}/audio`);
        const { sound } = await Audio.Sound.createAsync(
          { uri: `${API_URL}/api/songs/${songId}/audio` },
          { shouldPlay: true }
        );
        soundRef.current = sound;

        // Détecter la fin de la chanson
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish && !hasNavigated.current) {
            hasNavigated.current = true;
            clearInterval(intervalRef.current);
            navigation.replace('VoteStar', { lobbyId, role, hostId: singerId });
          }
        });

        // Cleanup
        return () => {
          clearInterval(intervalRef.current);
          soundRef.current?.unloadAsync();
        };
      } catch (err) {
        console.warn('Erreur chargement chanson :', err.message);
      }
    };

    if (songId) loadSong();

    return () => clearInterval(intervalRef.current);
  }, [songId]);

  // ─── Fin de la chanson ────────────────────────────────────────────────────
  useEffect(() => {
    if (status?.didJustFinish && !hasNavigated.current) {
      hasNavigated.current = true;
      clearInterval(intervalRef.current);
      navigation.replace('VoteStar', { lobbyId, role, hostId: singerId });
    }
  }, [status?.didJustFinish]);

  // Scroll automatique
  useEffect(() => {
    if (scrollRef && currentLineIndex > 2) {
      scrollRef.scrollTo({
        y: currentLineIndex * 40,  // 40px par ligne approximativement
        animated: true
      });
    }
  }, [currentLineIndex]);

  useEffect(() => {
    lyricsRef.current = lyrics;
  }, [lyrics]);

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
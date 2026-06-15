/**
 * LyricsController.js
 * Fusion : nos corrections + changements de Rosalie
 */

import React, { useEffect, useRef, useState } from 'react';
import LyricsView from '../views/LyricsView';
import Toast from '../components/Toast';
import { getSocket, joinRoom } from '../services/socketService';
import { API_URL } from '../config';
import {
  connectToRoom,
  applySingerMicPolicy,
  enableLobbyMicrophones,
} from '../services/livekitService';
import { useToast } from '../hooks/useToast';
import { createSongPlayer } from '../utils/songAudioPlayer';

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

const SKIP_THRESHOLD = 0.5;

export default function LyricsController({ route, navigation }) {
  const { lobbyId, role, currentSong, singerId, songId, pseudo, avatarIndex: avatarIndexParam, userId } = route.params;

  const singerSocketId = singerId?.socketId || singerId;

  const socketRef = useRef(null);
  const soundRef = useRef(null);
  const intervalRef = useRef(null);
  const hasNavigated = useRef(false);
  const lyricsRef = useRef([]);
  const avatarIndexRef = useRef(avatarIndexParam ?? 0);

  const [lyrics, setLyrics] = useState([]);
  const [lyricsLoading, setLyricsLoading] = useState(true);
  const [lyricsError, setLyricsError] = useState(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [reactions, setReactions] = useState([]);
  const [queue, setQueue] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [scrollRef, setScrollRef] = useState(null);
  const [skipVotes, setSkipVotes] = useState(new Set());
  const [selectedSongIndex, setSelectedSongIndex] = useState(null);
  const { toast, showToast } = useToast();

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


  // ─── Socket ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    socket.emit('get-queue', { roomCode: lobbyId });
    socket.emit('get-participants', { roomCode: lobbyId });

    socket.on('queue-updated', (updatedQueue) => setQueue(updatedQueue));

    socket.on('participants-list', (list) => {
      if (!Array.isArray(list)) return;
      setParticipants(list.map(p => ({
        ...p,
        isSinging: p.userId === singerSocketId,
      })));
    });

    socket.on('user-joined', ({ userId, pseudo: p, avatarIndex: av, isHost }) => {
      setParticipants((prev) => {
        if (prev.find(x => x.userId === userId)) return prev;
        return [...prev, {
          userId,
          pseudo: p,
          avatarIndex: av ?? 0,
          isHost: !!isHost,
          isSinging: userId === singerSocketId,
        }];
      });
    });

    socket.on('user-left', ({ userId }) => {
      setParticipants((prev) => prev.filter(p => p.userId !== userId));
    });

    socket.on('reaction-received', ({ type, userId }) => {
      const id = Date.now() + Math.random();
      setReactions((prev) => [...prev, { id, type, userId }]);
      setTimeout(() => setReactions((prev) => prev.filter(r => r.id !== id)), 2000);
    });

    socket.on('skip-vote', ({ userId, totalVotes, totalParticipants }) => {
      setSkipVotes(prev => new Set([...prev, userId]));
      if (totalVotes / totalParticipants >= SKIP_THRESHOLD) {
        handleSkipSong();
      }
    });

    socket.on('turn-skipped', async () => {
      await enableLobbyMicrophones();
      navigation.replace('Lobby', {
        lobbyId,
        role,
        pseudo,
        avatarIndex: avatarIndexRef.current,
        userId,
      });
    });

    socket.on('connect_error', (err) => {
      console.warn('Erreur socket lyrics :', err.message);
    });

    return () => {
      socket.off('queue-updated');
      socket.off('participants-list');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('reaction-received');
      socket.off('skip-vote');
      socket.off('turn-skipped');
      socket.off('connect_error');
    };
  }, [lobbyId]);

  // ─── Paroles + Audio ──────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    const loadSong = async () => {
      if (!songId) {
        if (isMounted) {
          setLyricsLoading(false);
          setLyricsError('Chanson introuvable.');
        }
        return;
      }

      setLyricsLoading(true);
      setLyricsError(null);

      try {
        const lyricsRes = await fetch(`${API_URL}/api/songs/${songId}/lyrics`);
        if (!lyricsRes.ok) {
          const err = await lyricsRes.json().catch(() => ({}));
          throw new Error(err.error || `HTTP ${lyricsRes.status}`);
        }
        const lyricsData = await lyricsRes.json();
        const parsed = parseLrc(lyricsData.lyrics);
        if (!isMounted) return;

        if (parsed.length === 0) {
          throw new Error('Aucune ligne de paroles trouvée.');
        }

        setLyrics(parsed);
        lyricsRef.current = parsed;
        setLyricsLoading(false);

        try {
          const player = await createSongPlayer(`${API_URL}/api/songs/${songId}/audio`);
          if (!isMounted) {
            await player.unload();
            return;
          }
          soundRef.current = player;
        } catch (audioErr) {
          console.warn('Erreur lecture audio :', audioErr.message);
        }

        intervalRef.current = setInterval(async () => {
          if (!soundRef.current) return;
          const status = await soundRef.current.getStatus();
          if (!status.isLoaded) return;

          const positionMs = status.positionMillis;
          const arr = lyricsRef.current;
          let idx = 0;
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].timeMs <= positionMs) idx = i;
            else break;
          }
          setCurrentLineIndex(idx);  

          if (status.didJustFinish && !hasNavigated.current) {
            hasNavigated.current = true;
            clearInterval(intervalRef.current);
            await enableLobbyMicrophones();

            const socket = socketRef.current;

            socket.once('song-finished-ack', ({ remaining }) => {
              if (remaining > 0) {
                navigation.replace('Lobby', {
                  lobbyId,
                  role,
                  pseudo,
                  avatarIndex: avatarIndexRef.current,
                  userId,
                });
              } else {
                navigation.replace('VoteStar', {
                  lobbyId,
                  role,
                  hostId: singerId,
                  pseudo,
                  avatarIndex: avatarIndexRef.current,
                  userId,
                });
              }
            });

            socket.emit('song-finished', { roomCode: lobbyId });
          }
        }, 200);

      } catch (err) {
        console.warn('Erreur chargement chanson :', err.message);
        if (isMounted) {
          setLyricsLoading(false);
          setLyricsError(err.message || 'Impossible de charger les paroles.');
        }
      }
    };

    loadSong();

    return () => {
      isMounted = false;
      clearInterval(intervalRef.current);
      soundRef.current?.unload();
    };
  }, [songId]);

  useEffect(() => { lyricsRef.current = lyrics; }, [lyrics]);

  useEffect(() => {
    if (scrollRef && currentLineIndex > 2) {
      scrollRef.scrollTo({ y: currentLineIndex * 40, animated: true });
    }
  }, [currentLineIndex]);

  const handleReaction = (type) => {
    socketRef.current?.emit('send-reaction', { roomCode: lobbyId, type });
  };

  const handleSkipVote = () => {
    socketRef.current?.emit('vote-skip', { roomCode: lobbyId });
    showToast('skipVote');
  };

  const handleSkipSong = async () => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    clearInterval(intervalRef.current);
    await soundRef.current?.stop();
    await enableLobbyMicrophones();
    navigation.replace('VoteStar', {
      lobbyId,
      role,
      hostId: singerId,
      pseudo,
      avatarIndex: avatarIndexRef.current,
      userId,
    });
  };

  const handleOpenQueue = () => {
    navigation.navigate('Lobby', { lobbyId, role, pseudo, avatarIndex: avatarIndexRef.current });
  };

  const handleSelectSong = (index) => {
    setSelectedSongIndex(prev => prev === index ? null : index);
  };

  return (
    <>
      <LyricsView
        lyrics={lyrics}
        lyricsLoading={lyricsLoading}
        lyricsError={lyricsError}
        currentLineIndex={currentLineIndex}
        currentSong={currentSong}
        queue={queue}
        reactions={reactions}
        participants={participants}
        singerSocketId={singerSocketId}
        role={role}
        skipVotes={skipVotes}
        totalParticipants={participants.length}
        skipThreshold={SKIP_THRESHOLD}
        selectedSongIndex={selectedSongIndex}
        onReaction={handleReaction}
        onSkipVote={handleSkipVote}
        onOpenQueue={handleOpenQueue}
        onScrollRef={setScrollRef}
        onSelectSong={handleSelectSong}
      />
      {toast ? <Toast {...toast} /> : null}
    </>
  );
}
// /**
//  * LyricsController.js
//  */

// import React, { useEffect, useRef, useState } from 'react';
// import { Audio } from 'expo-av';
// import LyricsView from '../views/LyricsView';
// import { getSocket, joinRoom } from '../services/socketService';
// import { API_URL } from '../config';

// function parseLrc(lrcContent) {
//   const lines = lrcContent.split('\n');
//   const result = [];
//   const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
//   for (const line of lines) {
//     const match = timeRegex.exec(line);
//     if (!match) continue;
//     const minutes = parseInt(match[1]);
//     const seconds = parseInt(match[2]);
//     const ms      = parseInt(match[3].padEnd(3, '0'));
//     const timeMs  = (minutes * 60 + seconds) * 1000 + ms;
//     const text    = line.replace(timeRegex, '').trim();
//     if (text) result.push({ timeMs, text });
//   }
//   return result.sort((a, b) => a.timeMs - b.timeMs);
// }

// const SKIP_THRESHOLD = 0.5; // 50% des participants doivent voter pour skip

// export default function LyricsController({ route, navigation }) {
//   const { lobbyId, role, currentSong, singerId, songId, pseudo, avatarIndex } = route.params;

//   const socketRef    = useRef(null);
//   const soundRef     = useRef(null);
//   const intervalRef  = useRef(null);
//   const hasNavigated = useRef(false);
//   const lyricsRef    = useRef([]);

//   const [lyrics, setLyrics]                     = useState([]);
//   const [currentLineIndex, setCurrentLineIndex] = useState(0);
//   const [reactions, setReactions]               = useState([]);
//   const [queue, setQueue]                       = useState([]);
//   // Participants : [{ userId, pseudo, avatarIndex, isHost, isSinging }]
//   const [participants, setParticipants]         = useState([]);
//   const [scrollRef, setScrollRef]               = useState(null);
//   // Skip votes : Set de socketIds ayant voté
//   const [skipVotes, setSkipVotes]               = useState(new Set());

//   // ─── Charger la queue initiale depuis roomState via socket ────────────────
//   useEffect(() => {
//     const socket = getSocket();
//     socketRef.current = socket;

//     joinRoom(lobbyId, pseudo, avatarIndex);

//     // Demander la queue actuelle au serveur au montage
//     socket.emit('get-queue', { roomCode: lobbyId });
//     // Demander la liste des participants actuels
//     socket.emit('get-participants', { roomCode: lobbyId });

//     socket.on('connect', () => {
//       joinRoom(lobbyId, pseudo, avatarIndex);
//       socket.emit('get-queue', { roomCode: lobbyId });
//       socket.emit('get-participants', { roomCode: lobbyId });
//     });

//     socket.on('queue-updated', (updatedQueue) => setQueue(updatedQueue));

//     // Réponse initiale à get-participants
//     socket.on('participants-list', (list) => {
//       // list : [{ userId, pseudo, avatarIndex, isHost }]
//       setParticipants(list.map(p => ({
//         ...p,
//         isSinging: p.userId === singerId,
//       })));
//     });

//     socket.on('user-joined', ({ userId, pseudo: p, avatarIndex: av }) => {
//       setParticipants((prev) => {
//         if (prev.find(x => x.userId === userId)) return prev;
//         return [...prev, { userId, pseudo: p, avatarIndex: av, isHost: false, isSinging: userId === singerId }];
//       });
//     });

//     socket.on('user-left', ({ userId }) => {
//       setParticipants((prev) => prev.filter(p => p.userId !== userId));
//     });

//     socket.on('reaction-received', ({ type, userId }) => {
//       const id = Date.now() + Math.random();
//       setReactions((prev) => [...prev, { id, type, userId }]);
//       setTimeout(() => {
//         setReactions((prev) => prev.filter((r) => r.id !== id));
//       }, 2000);
//     });

//     // Vote skip reçu d'un autre participant
//     socket.on('skip-vote', ({ userId, totalVotes, totalParticipants }) => {
//       setSkipVotes(prev => new Set([...prev, userId]));
//       // Si le seuil est atteint → skip
//       if (totalVotes / totalParticipants >= SKIP_THRESHOLD) {
//         handleSkipSong();
//       }
//     });

//     return () => {
//       socket.off('connect');
//       socket.off('queue-updated');
//       socket.off('participants-list');
//       socket.off('user-joined');
//       socket.off('user-left');
//       socket.off('reaction-received');
//       socket.off('skip-vote');
//     };
//   }, [lobbyId]);

//   // ─── Charger paroles + audio ──────────────────────────────────────────────
//   useEffect(() => {
//     const loadSong = async () => {
//       try {
//         const lyricsRes  = await fetch(`${API_URL}/songs/${songId}/lyrics`);
//         if (!lyricsRes.ok) throw new Error(`HTTP ${lyricsRes.status}`);
//         const lyricsData = await lyricsRes.json();
//         // La route retourne { lyrics: '<contenu LRC>' }
//         const parsed = parseLrc(lyricsData.lyrics);
//         setLyrics(parsed);
//         lyricsRef.current = parsed;

//         await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
//         const { sound } = await Audio.loadAsync(
//           { uri: `${API_URL}/songs/${songId}/audio` },
//           { shouldPlay: true }
//         );
//         soundRef.current = sound;

//         intervalRef.current = setInterval(async () => {
//           if (!soundRef.current) return;
//           const status = await soundRef.current.getStatusAsync();
//           if (!status.isLoaded) return;

//           const positionMs = status.positionMillis;
//           const arr = lyricsRef.current;
//           let idx = 0;
//           for (let i = 0; i < arr.length; i++) {
//             if (arr[i].timeMs <= positionMs) idx = i;
//             else break;
//           }
//           setCurrentLineIndex(idx);

//           if (status.didJustFinish && !hasNavigated.current) {
//             hasNavigated.current = true;
//             clearInterval(intervalRef.current);
//             navigation.replace('VoteStar', { lobbyId, role, hostId: singerId });
//           }
//         }, 200);

//       } catch (err) {
//         console.warn('Erreur chargement chanson :', err.message);
//       }
//     };

//     if (songId) loadSong();

//     return () => {
//       clearInterval(intervalRef.current);
//       soundRef.current?.unloadAsync();
//     };
//   }, [songId]);

//   useEffect(() => {
//     lyricsRef.current = lyrics;
//   }, [lyrics]);

//   useEffect(() => {
//     if (scrollRef && currentLineIndex > 2) {
//       scrollRef.scrollTo({ y: currentLineIndex * 40, animated: true });
//     }
//   }, [currentLineIndex]);

//   // ─── Actions ──────────────────────────────────────────────────────────────
//   const handleReaction = (type) => {
//     socketRef.current?.emit('send-reaction', { roomCode: lobbyId, type });
//   };

//   const handleSkipVote = () => {
//     const socket = socketRef.current;
//     if (!socket) return;
//     socket.emit('vote-skip', { roomCode: lobbyId });
//   };

//   const handleSkipSong = async () => {
//     if (hasNavigated.current) return;
//     hasNavigated.current = true;
//     clearInterval(intervalRef.current);
//     await soundRef.current?.stopAsync();
//     navigation.replace('VoteStar', { lobbyId, role, hostId: singerId });
//   };

//   const handleOpenQueue = () => {
//     navigation.navigate('Lobby', { lobbyId, role });
//   };

//   return (
//     <LyricsView
//       lyrics={lyrics}
//       currentLineIndex={currentLineIndex}
//       currentSong={currentSong}
//       queue={queue}
//       reactions={reactions}
//       participants={participants}
//       singerId={singerId}
//       role={role}
//       skipVotes={skipVotes}
//       totalParticipants={participants.length + 1}
//       skipThreshold={SKIP_THRESHOLD}
//       onReaction={handleReaction}
//       onSkipVote={handleSkipVote}
//       onOpenQueue={handleOpenQueue}
//       onScrollRef={setScrollRef}
//     />
//   );
// // }
// /**
//  * LyricsController.js
//  */

// import React, { useEffect, useRef, useState } from 'react';
// import { Audio } from 'expo-av';
// import LyricsView from '../views/LyricsView';
// import { getSocket, joinRoom } from '../services/socketService';
// import { API_URL } from '../config';

// function parseLrc(lrcContent) {
//   const lines = lrcContent.split('\n');
//   const result = [];
//   const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
//   for (const line of lines) {
//     const match = timeRegex.exec(line);
//     if (!match) continue;
//     const minutes = parseInt(match[1]);
//     const seconds = parseInt(match[2]);
//     const ms      = parseInt(match[3].padEnd(3, '0'));
//     const timeMs  = (minutes * 60 + seconds) * 1000 + ms;
//     const text    = line.replace(timeRegex, '').trim();
//     if (text) result.push({ timeMs, text });
//   }
//   return result.sort((a, b) => a.timeMs - b.timeMs);
// }

// const SKIP_THRESHOLD = 0.5;

// export default function LyricsController({ route, navigation }) {
//   const { lobbyId, role, currentSong, singerId, songId, pseudo, avatarIndex } = route.params;

//   // singerId peut être un objet { socketId, pseudo, avatarIndex } ou une string
//   const singerSocketId = singerId?.socketId || singerId;

//   const socketRef    = useRef(null);
//   const soundRef     = useRef(null);
//   const intervalRef  = useRef(null);
//   const hasNavigated = useRef(false);
//   const lyricsRef    = useRef([]);

//   const [lyrics, setLyrics]                       = useState([]);
//   const [currentLineIndex, setCurrentLineIndex]   = useState(0);
//   const [reactions, setReactions]                 = useState([]);
//   const [queue, setQueue]                         = useState([]);
//   const [participants, setParticipants]           = useState([]);
//   const [scrollRef, setScrollRef]                 = useState(null);
//   const [skipVotes, setSkipVotes]                 = useState(new Set());
//   const [selectedSongIndex, setSelectedSongIndex] = useState(null);

//   // ─── Socket ───────────────────────────────────────────────────────────────
//   useEffect(() => {
//     const socket = getSocket();
//     socketRef.current = socket;

//     // On passe isHost pour que le backend puisse le stocker
//     joinRoom(lobbyId, pseudo, avatarIndex, role === 'host');

//     socket.emit('get-queue',        { roomCode: lobbyId });
//     socket.emit('get-participants', { roomCode: lobbyId });

//     socket.on('connect', () => {
//       joinRoom(lobbyId, pseudo, avatarIndex, role === 'host');
//       socket.emit('get-queue',        { roomCode: lobbyId });
//       socket.emit('get-participants', { roomCode: lobbyId });
//     });

//     socket.on('queue-updated', (updatedQueue) => setQueue(updatedQueue));

//     socket.on('participants-list', (list) => {
//       if (!Array.isArray(list)) return;
//       setParticipants(list.map(p => ({
//         ...p,
//         isSinging: p.userId === singerSocketId,
//       })));
//     });

//     socket.on('user-joined', ({ userId, pseudo: p, avatarIndex: av, isHost }) => {
//       setParticipants((prev) => {
//         if (prev.find(x => x.userId === userId)) return prev;
//         return [...prev, {
//           userId,
//           pseudo: p,
//           avatarIndex: av ?? 0,
//           isHost: !!isHost,
//           isSinging: userId === singerSocketId,
//         }];
//       });
//     });

//     socket.on('user-left', ({ userId }) => {
//       setParticipants((prev) => prev.filter(p => p.userId !== userId));
//     });

//     socket.on('reaction-received', ({ type, userId }) => {
//       const id = Date.now() + Math.random();
//       setReactions((prev) => [...prev, { id, type, userId }]);
//       setTimeout(() => setReactions((prev) => prev.filter(r => r.id !== id)), 2000);
//     });

//     socket.on('skip-vote', ({ userId, totalVotes, totalParticipants }) => {
//       setSkipVotes(prev => new Set([...prev, userId]));
//       if (totalVotes / totalParticipants >= SKIP_THRESHOLD) {
//         handleSkipSong();
//       }
//     });

//     return () => {
//       socket.off('connect');
//       socket.off('queue-updated');
//       socket.off('participants-list');
//       socket.off('user-joined');
//       socket.off('user-left');
//       socket.off('reaction-received');
//       socket.off('skip-vote');
//     };
//   }, [lobbyId]);

//   // ─── Paroles + Audio ──────────────────────────────────────────────────────
//   useEffect(() => {
//     const loadSong = async () => {
//       try {
//         const lyricsRes = await fetch(`${API_URL}/songs/${songId}/lyrics`);
//         if (!lyricsRes.ok) throw new Error(`HTTP ${lyricsRes.status}`);
//         const lyricsData = await lyricsRes.json();
//         const parsed = parseLrc(lyricsData.lyrics);
//         setLyrics(parsed);
//         lyricsRef.current = parsed;

//         await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
//         const { sound } = await Audio.loadAsync(
//           { uri: `${API_URL}/songs/${songId}/audio` },
//           { shouldPlay: true }
//         );
//         soundRef.current = sound;

//         intervalRef.current = setInterval(async () => {
//           if (!soundRef.current) return;
//           const status = await soundRef.current.getStatusAsync();
//           if (!status.isLoaded) return;

//           const positionMs = status.positionMillis;
//           const arr = lyricsRef.current;
//           let idx = 0;
//           for (let i = 0; i < arr.length; i++) {
//             if (arr[i].timeMs <= positionMs) idx = i;
//             else break;
//           }
//           setCurrentLineIndex(idx);

//           if (status.didJustFinish && !hasNavigated.current) {
//             hasNavigated.current = true;
//             clearInterval(intervalRef.current);
//             navigation.replace('VoteStar', { lobbyId, role, hostId: singerId, pseudo, avatarIndex });
//           }
//         }, 200);

//       } catch (err) {
//         console.warn('Erreur chargement chanson :', err.message);
//       }
//     };

//     if (songId) loadSong();

//     return () => {
//       clearInterval(intervalRef.current);
//       soundRef.current?.unloadAsync();
//     };
//   }, [songId]);

//   useEffect(() => { lyricsRef.current = lyrics; }, [lyrics]);

//   useEffect(() => {
//     if (scrollRef && currentLineIndex > 2) {
//       scrollRef.scrollTo({ y: currentLineIndex * 40, animated: true });
//     }
//   }, [currentLineIndex]);

//   // ─── Actions ──────────────────────────────────────────────────────────────
//   const handleReaction = (type) => {
//     socketRef.current?.emit('send-reaction', { roomCode: lobbyId, type });
//   };

//   const handleSkipVote = () => {
//     socketRef.current?.emit('vote-skip', { roomCode: lobbyId });
//   };

//   const handleSkipSong = async () => {
//     if (hasNavigated.current) return;
//     hasNavigated.current = true;
//     clearInterval(intervalRef.current);
//     await soundRef.current?.stopAsync();
//     navigation.replace('VoteStar', { lobbyId, role, hostId: singerId, pseudo, avatarIndex });
//   };

//   // FIX : on passe pseudo + avatarIndex pour ne pas perdre l'identité au retour
//   const handleOpenQueue = () => {
//     navigation.navigate('Lobby', { lobbyId, role, pseudo, avatarIndex });
//   };

//   const handleSelectSong = (index) => {
//     setSelectedSongIndex(prev => prev === index ? null : index);
//   };

//   return (
//     <LyricsView
//       lyrics={lyrics}
//       currentLineIndex={currentLineIndex}
//       currentSong={currentSong}
//       queue={queue}
//       reactions={reactions}
//       participants={participants}
//       singerSocketId={singerSocketId}
//       role={role}
//       skipVotes={skipVotes}
//       totalParticipants={participants.length}
//       skipThreshold={SKIP_THRESHOLD}
//       selectedSongIndex={selectedSongIndex}
//       onReaction={handleReaction}
//       onSkipVote={handleSkipVote}
//       onOpenQueue={handleOpenQueue}
//       onScrollRef={setScrollRef}
//       onSelectSong={handleSelectSong}
//     />
//   );
//}
/**
 * LyricsController.js
 * Fusion : nos corrections + changements de Rosalie
 */

import React, { useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import LyricsView from '../views/LyricsView';
import { getSocket } from '../services/socketService';
import { API_URL } from '../config';

if (Platform.OS === 'web' && !global.SyntheticPlatformEmitter) {
  global.SyntheticPlatformEmitter = {
    emit: () => {},
    addListener: () => {},
    removeListener: () => {},
  };
}

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
  const { lobbyId, role, currentSong, singerId, songId, pseudo, avatarIndex: avatarIndexParam } = route.params;

  const singerSocketId = singerId?.socketId || singerId;

  const socketRef      = useRef(null);
  const soundRef       = useRef(null);
  const intervalRef    = useRef(null);
  const hasNavigated   = useRef(false);
  const lyricsRef      = useRef([]);
  const avatarIndexRef = useRef(avatarIndexParam ?? 0);

  const [lyrics, setLyrics]                       = useState([]);
  const [currentLineIndex, setCurrentLineIndex]   = useState(0);
  const [reactions, setReactions]                 = useState([]);
  const [queue, setQueue]                         = useState([]);
  const [participants, setParticipants]           = useState([]);
  const [scrollRef, setScrollRef]                 = useState(null);
  const [skipVotes, setSkipVotes]                 = useState(new Set());
  const [selectedSongIndex, setSelectedSongIndex] = useState(null);

  useEffect(() => {
    if (avatarIndexParam !== undefined) {
      avatarIndexRef.current = avatarIndexParam;
    }
  }, [avatarIndexParam]);

  // ─── Socket ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    socket.emit('get-queue',        { roomCode: lobbyId });
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

    socket.on('turn-skipped', () => {
      navigation.replace('Lobby', { lobbyId, role, pseudo, avatarIndex: avatarIndexRef.current });
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
      try {
        const lyricsRes = await fetch(`${API_URL}/api/songs/${songId}/lyrics`);
        if (!lyricsRes.ok) throw new Error(`HTTP ${lyricsRes.status}`);
        const lyricsData = await lyricsRes.json();
        const parsed = parseLrc(lyricsData.lyrics);
        if (!isMounted) return;
        setLyrics(parsed);
        lyricsRef.current = parsed;

        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound } = await Audio.Sound.createAsync(
          { uri: `${API_URL}/api/songs/${songId}/audio` },
          { shouldPlay: true }
        );
        if (!isMounted) {
          sound.unloadAsync();
          return;
        }
        soundRef.current = sound;

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

          if (status.didJustFinish && !hasNavigated.current) {
            hasNavigated.current = true;
            clearInterval(intervalRef.current);
            navigation.replace('VoteStar', {
              lobbyId, role, hostId: singerId,
              pseudo, avatarIndex: avatarIndexRef.current,
            });
          }
        }, 200);

      } catch (err) {
        console.warn('Erreur chargement chanson :', err.message);
      }
    };

    if (songId) loadSong();

    return () => {
      isMounted = false;
      clearInterval(intervalRef.current);
      soundRef.current?.unloadAsync();
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
  };

  const handleSkipSong = async () => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;
    clearInterval(intervalRef.current);
    await soundRef.current?.stopAsync();
    navigation.replace('VoteStar', {
      lobbyId, role, hostId: singerId,
      pseudo, avatarIndex: avatarIndexRef.current,
    });
  };

  const handleOpenQueue = () => {
    navigation.navigate('Lobby', { lobbyId, role, pseudo, avatarIndex: avatarIndexRef.current });
  };

  const handleSelectSong = (index) => {
    setSelectedSongIndex(prev => prev === index ? null : index);
  };

  return (
    <LyricsView
      lyrics={lyrics}
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
  );
}
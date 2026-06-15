import { Platform } from 'react-native';
import { Room, RoomEvent, Track } from 'livekit-client';
import { API_URL } from '../config';

let room = null;
let connectedSalonKey = null;
let audioUnlocked = false;
let audioHandlersRoom = null;

/** @type {Map<string, HTMLAudioElement>} */
const remoteAudioElements = new Map();

export const getRoom = () => room;

export const isRoomConnected = () => room?.state === 'connected';

export const isAudioUnlocked = () => audioUnlocked;

export const isMicEnabled = () => room?.localParticipant?.isMicrophoneEnabled ?? false;

const isWeb = Platform.OS === 'web';

function attachRemoteAudioTrack(track) {
  if (!isWeb || !track || track.kind !== Track.Kind.Audio) return null;

  if (remoteAudioElements.has(track.sid)) {
    return remoteAudioElements.get(track.sid);
  }

  const element = track.attach();
  element.autoplay = true;
  element.hidden = true;
  element.dataset.livekitTrack = track.sid;

  if (!element.isConnected) {
    document.body.appendChild(element);
  }

  remoteAudioElements.set(track.sid, element);

  if (audioUnlocked) {
    element.play().catch(() => {});
  }

  return element;
}

function detachRemoteAudioTrack(track) {
  if (!isWeb || !track) return;

  const element = remoteAudioElements.get(track.sid);
  track.detach(element);
  element?.remove();
  remoteAudioElements.delete(track.sid);
}

function clearRemoteAudioElements() {
  if (!isWeb) return;

  remoteAudioElements.forEach((element, sid) => {
    element.remove();
    remoteAudioElements.delete(sid);
  });
}

function syncRemoteAudioAttachments(activeRoom) {
  if (!isWeb || !activeRoom) return;

  activeRoom.remoteParticipants.forEach((participant) => {
    participant.audioTrackPublications.forEach((publication) => {
      if (publication.track) {
        attachRemoteAudioTrack(publication.track);
      }
    });
  });
}

function bindRoomAudioHandlers(activeRoom) {
  if (!isWeb || audioHandlersRoom === activeRoom) return;

  if (audioHandlersRoom) {
    audioHandlersRoom.off(RoomEvent.TrackSubscribed, onTrackSubscribed);
    audioHandlersRoom.off(RoomEvent.TrackUnsubscribed, onTrackUnsubscribed);
    audioHandlersRoom.off(RoomEvent.Disconnected, onRoomDisconnected);
  }

  activeRoom.on(RoomEvent.TrackSubscribed, onTrackSubscribed);
  activeRoom.on(RoomEvent.TrackUnsubscribed, onTrackUnsubscribed);
  activeRoom.on(RoomEvent.Disconnected, onRoomDisconnected);

  audioHandlersRoom = activeRoom;
  syncRemoteAudioAttachments(activeRoom);
}

function onTrackSubscribed(track) {
  attachRemoteAudioTrack(track);
  if (audioUnlocked && room) {
    room.startAudio().catch(() => {});
  }
}

function onTrackUnsubscribed(track) {
  detachRemoteAudioTrack(track);
}

function onRoomDisconnected() {
  clearRemoteAudioElements();
  audioHandlersRoom = null;
}

export const waitForLivekitReady = (timeoutMs = 10000) =>
  new Promise((resolve) => {
    if (room?.state === 'connected') {
      resolve(room);
      return;
    }

    const started = Date.now();
    const interval = setInterval(() => {
      if (room?.state === 'connected') {
        clearInterval(interval);
        resolve(room);
      } else if (Date.now() - started >= timeoutMs) {
        clearInterval(interval);
        resolve(null);
      }
    }, 100);
  });

export const activateLobbyAudio = async () => {
  const activeRoom = await waitForLivekitReady();
  if (!activeRoom) {
    return { audio: false, mic: false };
  }

  syncRemoteAudioAttachments(activeRoom);

  let audioOk = false;
  try {
    await activeRoom.startAudio();
    audioOk = true;
    audioUnlocked = true;
  } catch (err) {
    console.warn('Audio LiveKit non démarré:', err.message);
  }

  let micOk = false;
  try {
    micOk = await activeRoom.localParticipant.setMicrophoneEnabled(true);
  } catch (err) {
    console.warn('Erreur micro LiveKit:', err.message);
  }

  return { audio: audioOk, mic: Boolean(micOk) };
};

export const startRoomAudio = async () => {
  if (!room) return false;

  syncRemoteAudioAttachments(room);

  try {
    await room.startAudio();
    audioUnlocked = true;
    return true;
  } catch (err) {
    console.warn('Audio LiveKit non démarré:', err.message);
    return false;
  }
};

export const connectToRoom = async (lobbyId, userId) => {
  const salonKey = `${lobbyId}:${userId}`;

  if (room?.state === 'connected' && connectedSalonKey === salonKey) {
    bindRoomAudioHandlers(room);
    return room;
  }

  if (room) {
    room.disconnect();
    room = null;
    connectedSalonKey = null;
    audioHandlersRoom = null;
    clearRemoteAudioElements();
  }

  try {
    const salonRes = await fetch(`${API_URL}/api/salons/${lobbyId}`);
    if (!salonRes.ok) throw new Error('Salon introuvable');

    const salonData = await salonRes.json();

    const res = await fetch(`${API_URL}/api/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salon_id: salonData.id, user_id: userId }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Token LiveKit indisponible');
    }

    const { token, livekit_url: livekitUrl } = await res.json();
    if (!token || !livekitUrl) {
      throw new Error('Configuration LiveKit incomplète');
    }

    room = new Room({ autoSubscribe: true });
    bindRoomAudioHandlers(room);
    await room.connect(livekitUrl, token);
    connectedSalonKey = salonKey;
    console.log('LiveKit connecté');
    return room;
  } catch (err) {
    console.warn('Erreur connexion LiveKit:', err.message);
    room = null;
    connectedSalonKey = null;
    audioHandlersRoom = null;
    clearRemoteAudioElements();
    return null;
  }
};

export const disconnectFromRoom = () => {
  if (room) {
    room.disconnect();
    room = null;
    connectedSalonKey = null;
    audioUnlocked = false;
    audioHandlersRoom = null;
    clearRemoteAudioElements();
  }
};

export const setMicrophoneEnabled = async (enabled) => {
  const activeRoom = await waitForLivekitReady();
  if (!activeRoom) {
    console.warn('LiveKit non connecté, micro inchangé');
    return false;
  }

  try {
    await activeRoom.localParticipant.setMicrophoneEnabled(enabled);
    return activeRoom.localParticipant.isMicrophoneEnabled;
  } catch (err) {
    console.warn('Erreur micro LiveKit:', err.message);
    return false;
  }
};

export const enableMicrophone = () => setMicrophoneEnabled(true);

export const disableMicrophone = () => setMicrophoneEnabled(false);

export const toggleMicrophone = async () => {
  if (audioUnlocked) {
    await startRoomAudio();
  }
  const next = !isMicEnabled();
  return setMicrophoneEnabled(next);
};

/** Lobby + votes : tout le monde peut parler (micro activé). */
export const enableLobbyMicrophones = async () => {
  if (audioUnlocked) {
    await startRoomAudio();
  }
  return setMicrophoneEnabled(true);
};

/** Paroles / countdown : seul le chanteur garde le micro. */
export const applySingerMicPolicy = async (singerUserId, currentUserId) => {
  if (audioUnlocked) {
    await startRoomAudio();
  }
  if (Number(singerUserId) === Number(currentUserId)) {
    return setMicrophoneEnabled(true);
  }
  return setMicrophoneEnabled(false);
};

import { Room } from 'livekit-client';
import { API_URL } from '../config';

let room = null;
let connectedSalonKey = null;

export const getRoom = () => room;

export const isMicEnabled = () => room?.localParticipant?.isMicrophoneEnabled ?? false;

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

export const connectToRoom = async (lobbyId, userId) => {
  const salonKey = `${lobbyId}:${userId}`;

  if (room?.state === 'connected' && connectedSalonKey === salonKey) {
    return room;
  }

  if (room) {
    room.disconnect();
    room = null;
    connectedSalonKey = null;
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

    room = new Room();
    await room.connect(livekitUrl, token);
    connectedSalonKey = salonKey;
    console.log('LiveKit connecté');
    return room;
  } catch (err) {
    console.warn('Erreur connexion LiveKit:', err.message);
    room = null;
    connectedSalonKey = null;
    return null;
  }
};

export const disconnectFromRoom = () => {
  if (room) {
    room.disconnect();
    room = null;
    connectedSalonKey = null;
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
  const next = !isMicEnabled();
  return setMicrophoneEnabled(next);
};

/** Lobby + votes : tout le monde peut parler (micro activé). */
export const enableLobbyMicrophones = () => enableMicrophone();

/** Paroles / countdown : seul le chanteur garde le micro. */
export const applySingerMicPolicy = async (singerUserId, currentUserId) => {
  if (Number(singerUserId) === Number(currentUserId)) {
    return setMicrophoneEnabled(true);
  }
  return setMicrophoneEnabled(false);
};

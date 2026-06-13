import { Room } from 'livekit-client';
import { API_URL } from '../config';

let room = null;

export const connectToRoom = async (lobbyId, userId) => {
    try {
        const salonRes = await fetch(`${API_URL}/api/salons/${lobbyId}`);
        const salonData = await salonRes.json();

        const res = await fetch(`${API_URL}/api/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ salon_id: salonData.id, user_id: userId }),
        });
        console.log("TOKEN BODY:", { salon_id: salonData.id, user_id: userId });

        const { token, livekit_url } = await res.json();

        room = new Room();
        room.on('connected', () => {
            console.log("LiveKit connecté !");
        });
        await room.connect(livekit_url, token);

        return room;
    } catch (err) {
        console.warn('Erreur connexion LiveKit:', err.message);
        return null;
    }
};

export const disconnectFromRoom = () => {
    if (room) {
        room.disconnect();
        room = null;
    }
};

export const enableMicrophone = async () => {
    if (!room) {
        console.warn('LiveKit room non connectée, micro non activé');
        return;
    }
    await room.localParticipant.setMicrophoneEnabled(true);
};

export const disableMicrophone = async () => {
    if (room) {
        await room.localParticipant.setMicrophoneEnabled(false);
    }
};

export const toggleMicrophone = async () => {
    if (!room) return false;

    const enabled = room.localParticipant.isMicrophoneEnabled;
    const newState = !enabled;

    await room.localParticipant.setMicrophoneEnabled(newState);

    return newState;
};

export const waitForLivekitReady = async () => {
    return new Promise(resolve => {
        const interval = setInterval(() => {
            if (room && room.state === "connected") {
                clearInterval(interval);
                resolve(true);
            }
        }, 100);
    });
};


export const getRoom = () => room;

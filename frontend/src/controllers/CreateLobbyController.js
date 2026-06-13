/**
 * CreateLobbyController.js
 */

import React, { useState, useEffect, useRef } from 'react';
import { Share } from 'react-native';
import { LobbyModel } from '../models/LobbyModel';
import CreateLobbyView from '../views/CreateLobbyView';
import { API_URL } from '../config';
import { getSocket, joinRoom, disconnectSocket } from '../services/socketService';
import { saveSession } from '../services/sessionService';

export default function CreateLobbyController({ navigation }) {
  const [lobbyId, setLobbyId] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);


  const handleGenerate = async () => {
    try {
      const response = await fetch(`${API_URL}/api/salons`, { method: 'POST' });
      const salon = await response.json();
      setLobbyId(salon.code);
    } catch (err) {
      console.warn("Erreur génération code :", err.message);
    }
  };

  const createLobby = async () => {
    setLoading(true);
    try {
      let roomCode = lobbyId;
      if (!roomCode) {
        const response = await fetch(`${API_URL}/api/salons`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const salon = await response.json();
        roomCode = salon.code;
        setLobbyId(roomCode);
      }

      const finalPseudo = pseudo.trim() || `Hôte-${roomCode.slice(0, 3)}`;

      const salonRes = await fetch(`${API_URL}/api/salons/${roomCode}`);
      const salonData = await salonRes.json();
      const userRes = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salon_id: salonData.id,
          role: 'host',
          pseudo: finalPseudo,
          avatarIndex
        }),
      });

      const user = await userRes.json();

      const socket = getSocket();
      socketRef.current = socket;

      joinRoom(roomCode, finalPseudo, avatarIndex, user.id);
      await saveSession({ lobbyId: roomCode, role: 'host', pseudo: finalPseudo, avatarIndex, userId: user.id });

      navigation.navigate('Lobby', {
        lobbyId: roomCode,
        role: 'host',
        pseudo: finalPseudo,
        avatarIndex,
        userId: user.id,
      });

    } catch (err) {
      console.warn("Erreur création salon :", err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    socket.on('connect_error', (err) => {
      console.warn('Erreur connexion socket :', err.message);
    });

    return () => {
      socket.off('connect_error');
    };
  }, []);


  const handleShare = async () => {
    try {
      await Share.share({
        message: `Rejoins mon salon Karaoke O'Nine ! Code : ${lobbyId}`,
      });
    } catch (err) {
      console.warn('Share failed:', err);
    }
  };

  const handleBack = () => {
    disconnectSocket();
    navigation.goBack();
  };

  return (
    <CreateLobbyView
      lobbyId={lobbyId}
      onBack={handleBack}
      onShare={handleShare}
      onStart={createLobby}
      pseudo={pseudo}
      onChangePseudo={setPseudo}
      avatarIndex={avatarIndex}
      onSelectAvatar={setAvatarIndex}
      loading={loading}
      onGenerate={handleGenerate}
    />
  );
}
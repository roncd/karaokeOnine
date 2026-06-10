/**
 * CreateLobbyController.js
 * Generates a lobby ID on mount, connects socket as host, and navigates to Lobby
 */

import React, { useState, useEffect, useRef } from 'react';
import { Share } from 'react-native';
import { io } from 'socket.io-client';
import { LobbyModel } from '../models/LobbyModel';
import CreateLobbyView from '../views/CreateLobbyView';
import { API_URL } from '../config'
import { saveSession } from '../services/sessionService';

export default function CreateLobbyController({ navigation }) {
  const [lobbyId, setLobbyId] = useState('');
  const socketRef = useRef(null);
  const [pseudo, setPseudo] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);
  useEffect(() => {
    const createLobby = async () => {
      const response = await fetch(`${API_URL}/api/salons`, { method: 'POST' });
      const { code } = await response.json();
      setLobbyId(code);
    };

    createLobby();

    // Connexion socket
    socketRef.current = io(API_URL, {
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connecté (hôte) :', socketRef.current.id);
      // Rejoindre la room en tant qu'hôte
      socketRef.current.emit('join-room', { roomCode: lobbyId, pseudo, avatarIndex });
    });

    socketRef.current.on('connect_error', (err) => {
      console.warn('Erreur connexion socket :', err.message);
    });

    return () => {
      socketRef.current?.disconnect();
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

  const handleStart = async () => {
    // Naviguer vers le lobby en tant qu'hôte
    await saveSession({ lobbyId, role: 'host' });
    await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        salon_id: lobbyId,
        pseudo,
        role: 'host'
      })
    });
    navigation.navigate('Lobby', { lobbyId, role: 'host' });
  };

  const handleBack = () => {
    socketRef.current?.disconnect();
    navigation.goBack();
  };

  return (
    <CreateLobbyView
      lobbyId={lobbyId}
      onBack={handleBack}
      onShare={handleShare}
      onStart={handleStart}
      pseudo={pseudo}
      onChangePseudo={setPseudo}
      avatarIndex={avatarIndex}
      onSelectAvatar={setAvatarIndex}
    />
  );
}
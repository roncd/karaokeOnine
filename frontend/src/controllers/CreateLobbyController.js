/**
 * CreateLobbyController.js
 */

import React, { useState, useEffect, useRef } from 'react';
import { Share } from 'react-native';
import { LobbyModel } from '../models/LobbyModel';
import CreateLobbyView from '../views/CreateLobbyView';
import { API_URL } from '../config';
import { getSocket, joinRoom, disconnectSocket } from '../services/socketService';

export default function CreateLobbyController({ navigation }) {
  const [lobbyId, setLobbyId] = useState('');
  const lobbyIdRef = useRef('');
  const socketRef  = useRef(null);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const createLobby = async () => {
      try {
        const response = await fetch(`${API_URL}/api/salons`, { method: 'POST' });
        const { code } = await response.json();
        setLobbyId(code);
        lobbyIdRef.current = code;
        joinRoom(code);
      } catch (err) {
        const generated = LobbyModel.generateId();
        setLobbyId(generated);
        lobbyIdRef.current = generated;
        joinRoom(generated);
      }
    };

    createLobby();

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

  const handleStart = () => {
    navigation.navigate('Lobby', {
      lobbyId,
      role: 'host',
    });
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
      onStart={handleStart}
    />
  );
}
/**
 * CreateLobbyController.js
 * Generates a lobby ID on mount, connects socket as host, and navigates to Lobby
 */

import React, { useState, useEffect, useRef } from 'react';
import { Share } from 'react-native';
import { io } from 'socket.io-client';
import { LobbyModel } from '../models/LobbyModel';
import CreateLobbyView from '../views/CreateLobbyView';

const API_URL = 'https://karaoke-backend-latest-oyi2.onrender.com'; // Android emulator: 10.0.2.2 | vrai device: IP locale
const SOCKET_URL = API_URL
console.log(process.env.EXPO_PUBLIC_API_URL);
export default function CreateLobbyController({ navigation }) {
  const [lobbyId, setLobbyId] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
   const createLobby = async () => {
    const response = await fetch(`${API_URL}/api/salons`, { method: 'POST' });
    const { code } = await response.json();
    setLobbyId(code);
  };

  createLobby();
  
    // Connexion socket
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connecté (hôte) :', socketRef.current.id);
      // Rejoindre la room en tant qu'hôte
      socketRef.current.emit('join-room', code);
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

  const handleStart = () => {
    // Naviguer vers le lobby en tant qu'hôte
    navigation.navigate('Lobby', {
      lobbyId,
      role: 'host',
      socket: null, // on passe pas le socket en param, on le recrée dans LobbyController
    });
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
    />
  );
}
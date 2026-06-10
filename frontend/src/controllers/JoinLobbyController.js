/**
 * JoinLobbyController.js
 * Valide le code saisi, connecte le socket en tant que participant, navigue vers Lobby
 */

import React, { useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { LobbyModel } from '../models/LobbyModel';
import JoinLobbyView from '../views/JoinLobbyView';
import { API_URL } from '../config';
import { saveSession } from '../services/sessionService';

const SOCKET_URL = API_URL;; // Android emulator: 10.0.2.2 | vrai device: IP locale

export default function JoinLobbyController({ navigation }) {
  const [inputId, setInputId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);
  const [pseudo, setPseudo] = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);
  const handleChangeId = (text) => {
    const cleaned = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6);
    setInputId(cleaned);
    if (error) setError('');
  };

  const handleJoin = () => {
    const { valid, error: validationError } = LobbyModel.validateId(inputId);
    if (!valid) {
      setError(validationError);
      return;
    }

    const roomCode = LobbyModel.normaliseId(inputId);
    setLoading(true);

    // Connexion socket
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connecté (participant) :', socketRef.current.id);
      socketRef.current.emit('join-room', { roomCode, pseudo, avatarIndex });
    });

    // Confirmation que quelqu'un a rejoint (dont nous-mêmes)
    socketRef.current.on('user-joined', async ({ userId }) => {
      console.log('user-joined reçu :', userId);
      setLoading(false);

      // Enregistrer l'utilisateur en base
      await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          salon_id: roomCode,
          pseudo,
          role: 'guest'
        })
      });

      // Sauvegarder la session localement
      await saveSession({ lobbyId: roomCode, role: 'guest' });

      // Naviguer vers le lobby
      navigation.navigate('Lobby', {
        lobbyId: roomCode,
        role: 'guest',
      });
    });


    socketRef.current.on('room-full', () => {
      setError('full');
      setLoading(false);
    });

    socketRef.current.on('connect_error', (err) => {
      console.warn('Erreur connexion socket :', err.message);
      setError('Impossible de se connecter au serveur.');
      setLoading(false);
    });
  };

  const handleBack = () => {
    socketRef.current?.disconnect();
    navigation.goBack();
  };

  return (
    <JoinLobbyView
      inputId={inputId}
      onChangeId={handleChangeId}
      onJoin={handleJoin}
      onBack={handleBack}
      error={error}
      loading={loading}
      pseudo={pseudo}
      onChangePseudo={setPseudo}
      avatarIndex={avatarIndex}
      onSelectAvatar={setAvatarIndex}
    />
  );
}
/**
 * JoinLobbyController.js
 */

import React, { useState, useRef } from 'react';
import { LobbyModel } from '../models/LobbyModel';
import JoinLobbyView from '../views/JoinLobbyView';
import { API_URL } from '../config';
import { getSocket, joinRoom } from '../services/socketService';
import { saveSession } from '../services/sessionService';

export default function JoinLobbyController({ navigation }) {
  const [inputId, setInputId]         = useState('');
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [pseudo, setPseudo]           = useState('');
  const [avatarIndex, setAvatarIndex] = useState(0);
  const socketRef                     = useRef(null);

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

    const socket = getSocket();
    socketRef.current = socket;

    joinRoom(roomCode);

    socket.once('user-joined', async ({ userId }) => {
      console.log('user-joined reçu :', userId);
      setLoading(false);

      // Enregistrer l'utilisateur en base
      try {
        await fetch(`${API_URL}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            salon_id: roomCode,
            pseudo,
            role: 'guest',
          }),
        });
      } catch (err) {
        console.warn('Erreur création utilisateur :', err.message);
      }

      // Sauvegarder la session localement
      await saveSession({ lobbyId: roomCode, role: 'guest' });

      navigation.navigate('Lobby', {
        lobbyId: roomCode,
        role: 'guest',
        pseudo,
        avatarIndex,
      });
        
    });

    socket.on('room-full', () => {
      setError('full');
      setLoading(false);
    });

    socket.on('connect_error', (err) => {
      console.warn('Erreur connexion socket :', err.message);
      setError('Impossible de se connecter au serveur.');
      setLoading(false);
    });
  };

  const handleBack = () => {
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
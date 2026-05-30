/**
 * JoinLobbyController.js
 * Manages join-lobby form state and validation
 */

import React, { useState } from 'react';
import { LobbyModel } from '../models/LobbyModel';
import JoinLobbyView from '../views/JoinLobbyView';

export default function JoinLobbyController({ navigation }) {
  const [inputId, setInputId] = useState('');
  const [error, setError]     = useState('');

  const handleChangeId = (text) => {
    // Keep only alphanumeric, uppercase, max 6 chars
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
    const normalisedId = LobbyModel.normaliseId(inputId);
    // TODO: look up the lobby on your backend, then navigate to the lobby screen
    navigation.navigate('Lobby', { lobbyId: normalisedId, mode: 'guest' });
  };

  const handleBack = () => navigation.goBack();

  return (
    <JoinLobbyView
      inputId={inputId}
      onChangeId={handleChangeId}
      onJoin={handleJoin}
      onBack={handleBack}
      error={error}
    />
  );
}

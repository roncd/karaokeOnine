/**
 * CreateLobbyController.js
 * Generates a lobby ID on mount and handles sharing
 */

import React, { useState, useEffect } from 'react';
import { Share } from 'react-native';
import { LobbyModel } from '../models/LobbyModel';
import CreateLobbyView from '../views/CreateLobbyView';

export default function CreateLobbyController({ navigation }) {
  const [lobbyId, setLobbyId] = useState('');

  useEffect(() => {
    setLobbyId(LobbyModel.generateId());
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join my karaoke lobby! Code: ${lobbyId}`,
      });
    } catch (err) {
      console.warn('Share failed:', err);
    }
  };

  const handleBack = () => navigation.goBack();

  return (
    <CreateLobbyView
      lobbyId={lobbyId}
      onBack={handleBack}
      onShare={handleShare}
    />
  );
}

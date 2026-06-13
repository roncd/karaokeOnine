/**
 * HomeController.js
 * Wires navigation for the Home screen
 */

import React from 'react';
import HomeView from '../views/HomeView';
import { clearSession } from '../services/sessionService';

export default function HomeController({ navigation }) {
  const handleCreateLobby = async () => {
    await clearSession();
    navigation.navigate('CreateLobby');
  };
  const handleJoinLobby = async () => {
    await clearSession();
    navigation.navigate('JoinLobby');
  };
  return (
    <HomeView
      onCreateLobby={handleCreateLobby}
      onJoinLobby={handleJoinLobby}
    />
  );
}

/**
 * HomeController.js
 * Wires navigation for the Home screen
 */

import React from 'react';
import HomeView from '../views/HomeView';

export default function HomeController({ navigation }) {
  const handleCreateLobby = () => navigation.navigate('CreateLobby');
  const handleJoinLobby   = () => navigation.navigate('JoinLobby');

  return (
    <HomeView
      onCreateLobby={handleCreateLobby}
      onJoinLobby={handleJoinLobby}
    />
  );
}

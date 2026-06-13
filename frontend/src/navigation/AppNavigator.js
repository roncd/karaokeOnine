/**
 * AppNavigator.js
 * Root stack navigator — register every screen here
 */

import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getSession } from '../services/sessionService';
import { isWebRootPath, linking } from './linking';
import HomeController from '../controllers/HomeController';
import CreateLobbyController from '../controllers/CreateLobbyController';
import JoinLobbyController from '../controllers/JoinLobbyController';
import LobbyController from '../controllers/LobbyController';
import ReadyController from '../controllers/ReadyController';
import LyricsController from '../controllers/LyricsController';
import VoteStarController from '../controllers/VoteStarController';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState(undefined);

  useEffect(() => {
    const restoreSession = async () => {
      const session = await getSession();

      if (Platform.OS === 'web') {
        // Sur le web, l'URL gère CreateLobby / JoinLobby au rechargement.
        // On ne restaure la session Lobby que depuis la page d'accueil.
        if (isWebRootPath() && session?.lobbyId) {
          setInitialState({
            routes: [{ name: 'Lobby', params: session }],
            index: 0,
          });
        }
        setIsReady(true);
        return;
      }

      if (session?.lobbyId) {
        setInitialState({
          routes: [{ name: 'Lobby', params: session }],
          index: 0,
        });
      }

      setIsReady(true);
    };

    restoreSession();
  }, []);

  if (!isReady) return null;

  return (
    <NavigationContainer
      linking={Platform.OS === 'web' ? linking : undefined}
      initialState={initialState}
    >
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeController} />
        <Stack.Screen name="CreateLobby" component={CreateLobbyController} />
        <Stack.Screen name="JoinLobby" component={JoinLobbyController} />
        <Stack.Screen name="Lobby" component={LobbyController} />
        <Stack.Screen name="Ready" component={ReadyController} />
        <Stack.Screen name="Lyrics" component={LyricsController} />
        <Stack.Screen name="VoteStar" component={VoteStarController} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

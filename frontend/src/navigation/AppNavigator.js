/**
 * AppNavigator.js
 * Root stack navigator — register every screen here
 */

import { React, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getSession } from '../services/sessionService';
import HomeController from '../controllers/HomeController';
import CreateLobbyController from '../controllers/CreateLobbyController';
import JoinLobbyController from '../controllers/JoinLobbyController';
import LobbyController from '../controllers/LobbyController'; // TODO
import ReadyController from '../controllers/ReadyController';
import LyricsController from '../controllers/LyricsController';
import VoteStarController from '../controllers/VoteStarController';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [initialRoute, setInitialRoute] = useState(null);
  const [initialParams, setInitialParams] = useState(null);

  useEffect(() => {
    const restore = async () => {
      const session = await getSession();
      if (session) {
        setInitialRoute('Lobby');
        setInitialParams(session);
      } else {
        setInitialRoute('Home');
      }
    };
    restore();
  }, []);

  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={HomeController} />
        <Stack.Screen name="CreateLobby" component={CreateLobbyController} />
        <Stack.Screen name="JoinLobby" component={JoinLobbyController} />
        <Stack.Screen name="Lobby" component={LobbyController} initialParams={initialParams} />
        <Stack.Screen name="Ready" component={ReadyController} />
        <Stack.Screen name="Lyrics" component={LyricsController} />
        <Stack.Screen name="VoteStar" component={VoteStarController} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

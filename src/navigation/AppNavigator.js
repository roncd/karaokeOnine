/**
 * AppNavigator.js
 * Root stack navigator — register every screen here
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeController        from '../controllers/HomeController';
import CreateLobbyController from '../controllers/CreateLobbyController';
import JoinLobbyController   from '../controllers/JoinLobbyController';
// import LobbyController    from '../controllers/LobbyController'; // TODO

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home"        component={HomeController} />
        <Stack.Screen name="CreateLobby" component={CreateLobbyController} />
        <Stack.Screen name="JoinLobby"   component={JoinLobbyController} />
        {/* Add <Stack.Screen name="Lobby" component={LobbyController} /> when ready */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * HomeView.js
 * Pure presentational component for the Home screen
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

export default function HomeView({ onCreateLobby, onJoinLobby }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>

        {/* Title block */}
        <View style={styles.titleBlock}>
          <Text style={styles.emoji}>🎤</Text>
          <Text style={styles.title}>KARAOKE</Text>
          <Text style={styles.subtitle}>sing together, anywhere</Text>
        </View>

        {/* Action buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={onCreateLobby}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonIcon}>✦</Text>
            <Text style={styles.buttonText}>Create Lobby</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            onPress={onJoinLobby}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonIcon}>→</Text>
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
              Join Lobby
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  titleBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: 12,
    color: '#F5E642',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    letterSpacing: 3,
    color: '#888',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  buttonGroup: {
    width: '100%',
    gap: 14,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 4,
    gap: 10,
  },
  buttonPrimary: {
    backgroundColor: '#F5E642',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#F5E642',
  },
  buttonIcon: {
    fontSize: 18,
    color: '#0D0D0D',
    fontWeight: '700',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#0D0D0D',
    textTransform: 'uppercase',
  },
  buttonTextSecondary: {
    color: '#F5E642',
  },
});

/**
 * ReadyView.js
 * Écran "Prêt ?" — affiché avant que le chanteur commence
 * Chanteur : voit le bouton "Prêt ?"
 * Autres   : voient juste l'avatar et la barre qui défile
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';

// Avatars aléatoires depuis les assets
const AVATARS = [
  require('../../assets/avatars/avatar1.png'),
  require('../../assets/avatars/avatar2.png'),
  require('../../assets/avatars/avatar3.png'),
  require('../../assets/avatars/avatar4.png'),
  require('../../assets/avatars/avatar5.png'),
  require('../../assets/avatars/avatar6.png'),
  require('../../assets/avatars/avatar7.png'),
  require('../../assets/avatars/avatar8.png'),
];

// Choisir avatar basé sur singerId pour que tout le monde voie le même
const getAvatarForUser = (userId) => {
  if (!userId) return AVATARS[0];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATARS[Math.abs(hash) % AVATARS.length];
};

export default function ReadyView({
  isSinger,
  currentSong,
  timeLeft,
  total,
  skipped,
  onReady,
  singerId,
}) {
  const progress = timeLeft / total; // 1 → 0

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      {/* Logo */}
      <Image 
        source={require('../../assets/logo/logo_karaoke.png')} 
        style={styles.logo}
      />

      <View style={styles.container}>

        {/* Avatar + bouton prêt */}
        <View style={styles.avatarBlock}>
          <View style={styles.avatarCircle}>
            <Image source={getAvatarForUser(singerId)} style={styles.avatarImage} />
          </View>

          {isSinger && !skipped && (
            <TouchableOpacity style={styles.readyBtn} onPress={onReady}>
              <Text style={styles.readyBtnText}>Prêt ?</Text>
            </TouchableOpacity>
          )}

          {!isSinger && (
            <View style={styles.waitingBadge}>
              <Text style={styles.waitingText}>
                {skipped ? 'Tour passé...' : 'En attente...'}
              </Text>
            </View>
          )}

          {skipped && isSinger && (
            <Text style={styles.skippedText}>Tour passé !</Text>
          )}
        </View>

        {/* Chanson en cours */}
        {currentSong && (
          <Text style={styles.songTitle} numberOfLines={1}>
            {currentSong}
          </Text>
        )}

        {/* Barre de compte à rebours */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressBar, { flex: progress }]} />
          <View style={{ flex: 1 - progress }} />
        </View>

        {/* Secondes restantes */}
        <Text style={styles.countdown}>{timeLeft}s</Text>

      </View>
    </SafeAreaView>
  );
}

const YELLOW = '#F5E642';
const BG     = '#0B3D5E';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  logo: {
  width: 60,
  height: 60,
  resizeMode: 'contain',
},
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 32,
  },

  // Avatar
  avatarBlock: {
    alignItems: 'center',
    gap: 20,
  },
  avatarCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },

  // Bouton prêt
  readyBtn: {
    backgroundColor: YELLOW,
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 8,
  },
  readyBtnText: {
    color: '#0D0D0D',
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 1,
  },

  // Badge attente
  waitingBadge: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  waitingText: {
    color: '#fff',
    fontSize: 15,
    opacity: 0.7,
  },
  skippedText: {
    color: YELLOW,
    fontSize: 16,
    fontWeight: '700',
  },

  // Chanson
  songTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.8,
    textAlign: 'center',
  },

  // Barre de progression
  progressTrack: {
    flexDirection: 'row',
    width: '100%',
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  progressBar: {
    backgroundColor: YELLOW,
    borderRadius: 5,
  },

  // Countdown
  countdown: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    letterSpacing: 1,
  },
});
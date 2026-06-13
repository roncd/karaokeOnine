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
import styles from './viewStyles/ReadyView.styles';

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
// const getAvatarForUser = (userId) => {
//   if (!userId) return AVATARS[0];
//   let hash = 0;
//   for (let i = 0; i < userId.length; i++) {
//     hash = userId.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   return AVATARS[Math.abs(hash) % AVATARS.length];
// };
const getAvatarForUser = (singerId) => {
  // Si singerId est un objet avec avatarIndex, l'utiliser directement
  if (singerId?.avatarIndex !== undefined) {
    return AVATARS[singerId.avatarIndex % AVATARS.length];
  }
  // Fallback sur hash si c'est une string
  if (!singerId) return AVATARS[0];
  let hash = 0;
  const str = typeof singerId === 'string' ? singerId : JSON.stringify(singerId);
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATARS[Math.abs(hash) % AVATARS.length];
};

export default function ReadyView({
  isSinger,
  singerPseudo,
  singerAvatarIndex,
  currentSong,
  timeLeft,
  total,
  skipped,
  onReady,
  singerId,
}) {
  const progress = timeLeft / total; // 1 → 0
  const avatarSource = singerAvatarIndex != null
    ? AVATARS[singerAvatarIndex % AVATARS.length]
    : getAvatarForUser(singerId);

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
            <Image source={avatarSource} style={styles.avatarImage} />
          </View>

          {singerPseudo ? (
            <Text style={styles.singerName}>
              {isSinger ? 'C\'est ton tour !' : `${singerPseudo} va chanter`}
            </Text>
          ) : null}

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
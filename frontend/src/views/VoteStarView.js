/**
 * VoteStarView.js
 * Grille d'avatars pour voter pour la star
 * Sélectionné = cercle jaune + étoile
 * Après confirmation = écran résultat avec le gagnant
 */
import Toast from '../components/Toast';
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

const YELLOW = '#F5E642';
const BG     = '#0B3D5E';

// ─── Avatar cliquable ─────────────────────────────────────────────────────────
function AvatarItem({ userId, isHost, isSelected, hasVoted, onSelect }) {
  return (
    <TouchableOpacity
      style={styles.avatarWrapper}
      onPress={() => onSelect(userId)}
      disabled={hasVoted}
      activeOpacity={0.7}
    >
      <View style={[styles.avatarCircle, isSelected && styles.avatarCircleSelected]} />
      {isHost && <Image 
  source={require('../../assets/icon/icon_hote_karaoke.png')}
  style={styles.hostIcon}
/>}
    </TouchableOpacity>
  );
}

// ─── Écran résultat ───────────────────────────────────────────────────────────
function WinnerScreen({ winner, onContinue }) {
  return (
    <View style={styles.winnerContainer}>
      <Text style={styles.winnerTitle}>✦ La star de la soirée ! ✦</Text>
      <View style={styles.winnerAvatarCircle} />
      <TouchableOpacity style={styles.continueBtn} onPress={onContinue}>
        <Text style={styles.continueBtnText}>Retour au salon</Text>
      </TouchableOpacity>
    </View>
  );
}
// ─── VoteStarView ─────────────────────────────────────────────────────────────
export default function VoteStarView({
  participants,
  selectedId,
  winner,
  hasVoted,
  onSelect,
  onConfirm,
  onContinue,
}) {
  return (
    <>
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      {/* Logo */}
      <Image 
        source={require('../../assets/logo/logo_karaoke.png')} 
        style={styles.logo}
      />

      {winner ? (
        <WinnerScreen winner={winner} onContinue={onContinue} />
      ) : (
        <View style={styles.container}>

          <Text style={styles.title}>Vote pour la star</Text>

          {/* Grille avatars */}
          <View style={styles.grid}>
            {participants.map((userId) => (
              <AvatarItem
                key={userId}
                userId={userId}
                isHost={userId === hostId}
                isSelected={selectedId === userId}
                hasVoted={hasVoted}
                onSelect={onSelect}
              />
            ))}
          </View>

          {/* Message après vote */}
          {hasVoted && !winner && (
            <Text style={styles.waitingText}>Vote enregistré, en attente des autres...</Text>
          )}

          {/* Bouton confirmer */}
          {!hasVoted && (
            <TouchableOpacity
              style={[styles.confirmBtn, !selectedId && styles.confirmBtnDisabled]}
              onPress={onConfirm}
              disabled={!selectedId}
              activeOpacity={0.8}
            >
              <Text style={styles.confirmBtnText}>Confirmer</Text>
            </TouchableOpacity>
          )}

        </View>
      )}
    </SafeAreaView>
    <Toast message="Vote enregistré !" type="success" />
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },

  // Logo
logo: {
  width: 60,
  height: 60,
  resizeMode: 'contain',
},
  // Contenu principal
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 40,
  },
  title: {
    color: YELLOW,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
  },

  // Grille
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    maxWidth: 400,
  },

  // Avatar
  avatarWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapperSelected: {},
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarCircleSelected: {
    borderColor: YELLOW,
    borderWidth: 2.5,
  },
  hostIcon: {
  width: 20,
  height: 20,
  resizeMode: 'contain',
},
  // Bouton confirmer
  confirmBtn: {
    backgroundColor: YELLOW,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 8,
  },
  confirmBtnDisabled: {
    opacity: 0.35,
  },
  confirmBtnText: {
    color: '#0D0D0D',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1,
  },

  // Message attente
  waitingText: {
    color: '#fff',
    opacity: 0.6,
    fontSize: 14,
    textAlign: 'center',
  },

  // Écran gagnant
  winnerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    paddingHorizontal: 32,
  },
  winnerTitle: {
    color: YELLOW,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
  winnerAvatarWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerAvatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 3,
    borderColor: YELLOW,
  },
  winnerStar: {
    position: 'absolute',
    top: -12,
    right: -12,
    fontSize: 32,
    color: YELLOW,
  },
  winnerSubtitle: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.7,
  },
  continueBtn: {
    backgroundColor: YELLOW,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 8,
  },
  continueBtnText: {
    color: '#0D0D0D',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1,
  },
});
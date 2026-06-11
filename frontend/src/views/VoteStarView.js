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

// const YELLOW = '#F5E642';
// const BG     = '#0B3D5E';
import styles from './viewStyles/VoteStarView.styles';
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
  hostId, 
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
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

import styles from './viewStyles/VoteStarView.styles';
// ─── Avatar cliquable ─────────────────────────────────────────────────────────
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

function AvatarItem({ userId, pseudo, avatarIndex, isHost, isSelected, hasVoted, onSelect }) {
  const avatar = AVATARS[avatarIndex % AVATARS.length] ?? AVATARS[0];
  
  return (
    <TouchableOpacity
      style={styles.avatarWrapper}
      onPress={() => onSelect(userId)}
      disabled={hasVoted}
      activeOpacity={0.7}
    >
      <View style={[styles.avatarCircle, isSelected && styles.avatarCircleSelected]}>
        <Image source={avatar} style={styles.avatarImage} />
      </View>
      {isHost && (
        <Image
          source={require('../../assets/icon/icon_hote_karaoke.png')}
          style={styles.hostIcon}
        />
      )}
      <Text style={{ color: '#fff', fontSize: 11, marginTop: 4 }}>{pseudo}</Text>
    </TouchableOpacity>
  );
}

// ─── Écran résultat ───────────────────────────────────────────────────────────
    function WinnerScreen({ winner, participants, onContinue }) {
  const avatar = AVATARS[(winner.avatarIndex ?? 0) % AVATARS.length];
  
  return (
    <View style={styles.winnerContainer}>
      <Text style={styles.winnerTitle}>✦ La star de la soirée ! ✦</Text>
      <View style={styles.winnerAvatarCircle}>
        <Image source={avatar} style={styles.avatarImage} />
      </View>
      <Text style={{ color: '#F5E642', fontSize: 20, fontWeight: '800', marginTop: 12 }}>
        {winner.pseudo}
      </Text>
      <Text style={{ color: '#fff', opacity: 0.6, fontSize: 14, marginTop: 4 }}>
        {winner.votes} vote{winner.votes > 1 ? 's' : ''}
      </Text>
      <TouchableOpacity style={styles.continueBtn} onPress={onContinue}>
        <Text style={styles.continueBtnText}>Retour au salon</Text>
      </TouchableOpacity>
    </View>
  );
}
// ─── VoteStarView ─────────────────────────────────────────────────────────────
export default function VoteStarView({
  participants = [],
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
          <WinnerScreen winner={winner} participants={participants} onContinue={onContinue} />
        ) : (
          <View style={styles.container}>

            <Text style={styles.title}>Vote pour la star</Text>

            {/* Grille avatars */}
            <View style={styles.grid}>
              {participants.map((p) => (
                <AvatarItem
                  key={p.userId || p.id}
                  userId={p.userId || p.id}
                  pseudo={p.pseudo}
                  avatarIndex={p.avatarIndex}
                  isHost={(p.userId || p.id) === hostId}
                  isSelected={selectedId === (p.userId || p.id)}
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
      {hasVoted ? <Toast type="voteRecorded" /> : null}
    </>
  );
}
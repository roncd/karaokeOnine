/**
 * LyricsView.js
 * Affichage des paroles synchronisées
 * Desktop : layout deux colonnes (paroles | file d'attente)
 * Mobile  : paroles plein écran + bouton "..." pour la file
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  ScrollView,
  Modal,
  useWindowDimensions,
  Image,
  Animated,
} from 'react-native';
import styles from './viewStyles/LyricsView.styles';
// const YELLOW = '#F5E642';
// const BG = '#0B3D5E';
// const CARD = '#0D4D72';

// ─── Bulle de réaction animée ─────────────────────────────────────────────────
function ReactionBubble({ type }) {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 2000, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -60, duration: 2000, useNativeDriver: true }),
    ]).start();
  }, []);

  const emoji = type === 'heart' ? '❤️' : type === 'fire' ? '🎉' : '👍';

  return (
    <Animated.Text style={[styles.reactionBubble, { opacity, transform: [{ translateY }] }]}>
      {emoji}
    </Animated.Text>
  );
}

// ─── Item file d'attente ──────────────────────────────────────────────────────
function QueueItem({ title, isActive }) {
  return (
    <View style={[styles.queueItem, isActive && styles.queueItemActive]}>
      <Text
        style={[styles.queueItemText, isActive && styles.queueItemTextActive]} numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
}

// ─── LyricsView ───────────────────────────────────────────────────────────────
export default function LyricsView({
  lyrics,
  currentLineIndex,
  currentSong,
  queue,
  reactions,
  participants,
  role,
  onReaction,
  onOpenQueue,
  onScrollRef,
}) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [queueModalVisible, setQueueModalVisible] = useState(false);

  // ─── Panneau file d'attente ────────────────────────────────────────────────
  const QueuePanel = () => (
  <View style={styles.queuePanel}>
    {queue.map((title, index) => (
      <QueueItem key={`${title?.titre || title}-${index}`} title={title?.titre || title} isActive={index === 0} />
    ))}
      <TouchableOpacity style={styles.addQueueBtn} onPress={onOpenQueue}>
        <Text style={styles.addQueueBtnText}>＋</Text>
      </TouchableOpacity>
    </View>
  );

  // ─── Paroles ───────────────────────────────────────────────────────────────
  const LyricsPanel = () => (
    <View style={styles.lyricsPanel}>
      {lyrics.length === 0 ? (
        <Text style={styles.loadingText}>Chargement des paroles...</Text>
      ) : (
        lyrics.map((line, index) => {
          const isCurrent = index === currentLineIndex;
          const isPast = index < currentLineIndex;
          return (
            <Text
              key={index}
              style={[
                styles.lyricLine,
                isCurrent && styles.lyricLineCurrent,
                isPast && styles.lyricLinePast,
              ]}
            >
              {line.text}
            </Text>
          );
        })
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/logo/logo_karaoke.png')}
          style={styles.logo}
        />

        {/* Bouton "..." mobile uniquement */}
        {!isDesktop && (
          <TouchableOpacity
            style={styles.dotsBtn}
            onPress={() => setQueueModalVisible(true)}
          >
            <Text style={styles.dotsBtnText}>···</Text>
          </TouchableOpacity>
        )}

        {/* Bouton "+" desktop uniquement */}
        {isDesktop && (
          <TouchableOpacity style={styles.addBtn} onPress={onOpenQueue}>
            <Text style={styles.addBtnText}>＋</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Contenu principal */}
      <View style={[styles.content, isDesktop && styles.contentDesktop]}>

        {/* Paroles */}
        <ScrollView
          scrollEnabled={false}
          style={isDesktop ? styles.lyricsPanelDesktop : styles.lyricsPanelMobile}
          contentContainerStyle={styles.lyricsPanelContent}
          showsVerticalScrollIndicator={false}
          ref={onScrollRef}
        >
          <LyricsPanel />
        </ScrollView>

        {/* File d'attente — desktop uniquement */}
        {isDesktop && (
          <View style={styles.queuePanelDesktop}>
            <QueuePanel />
          </View>
        )}
      </View>

      {/* Bas de l'écran — avatars + réactions */}
      <View style={styles.footer}>

        {/* Réactions */}
        <View style={styles.reactionsRow}>
          {['heart', 'fire', 'like'].map((type) => (
            <TouchableOpacity
              key={type}
              style={styles.reactionBtn}
              onPress={() => onReaction(type)}
            >
              {/* on peut changer les emojis si besoin, pour qu'ils ressemblent au figma */}
              <Text style={styles.reactionBtnText}>
                {type === 'heart' ? '❤️' : type === 'fire' ? '🎉' : '👍'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Avatars participants */}
        <View style={styles.participantsRow}>
          <Text style={styles.participantCount}>👤 {participants.length + 1}</Text>
          <View style={styles.avatarCircle} />
          {participants.slice(0, 3).map((_, i) => (
            <View key={i} style={styles.avatarCircle} />
          ))}
        </View>

      </View>

      {/* Bulles de réactions animées */}
      <View style={styles.reactionsOverlay} pointerEvents="none">
        {reactions.map((r) => (
          <ReactionBubble key={r.id} type={r.type} />
        ))}
      </View>

      {/* Modal file d'attente — mobile */}
      <Modal
        visible={queueModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setQueueModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setQueueModalVisible(false)}>
                <Text style={styles.modalBack}>{'<'}</Text>
              </TouchableOpacity>
              <Text style={styles.modalCurrentSong} numberOfLines={1}>
                {currentSong}
              </Text>
              <TouchableOpacity style={styles.modalAddBtn} onPress={onOpenQueue}>
                <Text style={styles.modalAddBtnText}>＋</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={queue}
             keyExtractor={(item, i) => `${item.titre || item}-${i}`}
              renderItem={({ item, index }) => (
                <QueueItem title={item.titre || item} isActive={index === 0} />
              )}
            />

            {/* Réactions dans le modal */}
            <View style={styles.modalReactions}>
              {['heart', 'fire', 'like'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.reactionBtn}
                  onPress={() => { onReaction(type); setQueueModalVisible(false); }}
                >
                  <Text style={styles.reactionBtnText}>
                    {type === 'heart' ? '❤️' : type === 'fire' ? '🎉' : '👍'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

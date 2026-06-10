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

const YELLOW = '#F5E642';
const BG = '#0B3D5E';
const CARD = '#0D4D72';

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
      {queue.map((song, index) => (
        <QueueItem key={`${song.id}-${index}`} title={song-titre} isActive={index === 0} />
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
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <QueueItem title={item.titre} isActive={index === 0} />
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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  dotsBtn: { padding: 8 },
  dotsBtnText: { color: '#fff', fontSize: 20, letterSpacing: 2 },
  addBtn: {
    backgroundColor: YELLOW,
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#0D0D0D', fontSize: 20, fontWeight: '900' },

  // Contenu
  content: { flex: 1 },
  contentDesktop: { flexDirection: 'row' },

  // Paroles
  lyricsPanelMobile: { flex: 1 },
  lyricsPanelDesktop: { flex: 1 },
  lyricsPanelContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
    gap: 20,
  },
  lyricsPanel: { alignItems: 'center', gap: 20 },
  lyricLine: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 16,
    textAlign: 'center',
  },
  lyricLineCurrent: {
    color: YELLOW,
    fontSize: 20,
    fontWeight: '700',
  },
  lyricLinePast: {
    color: 'rgba(245,230,66,0.4)',
    fontSize: 15,
  },
  loadingText: { color: '#fff', opacity: 0.5, fontSize: 14 },

  // File d'attente desktop
  queuePanelDesktop: {
    width: 220,
    paddingTop: 16,
    paddingRight: 16,
    gap: 8,
  },
  queuePanel: { gap: 8 },
  queueItem: {
    backgroundColor: CARD,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  queueItemActive: {
    borderWidth: 1.5,
    borderColor: YELLOW,
  },
  queueItemText: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.7,
  },
  queueItemTextActive: {
    color: YELLOW,
    opacity: 1,
    fontWeight: '700',
  },
  addQueueBtn: {
    backgroundColor: YELLOW,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  addQueueBtnText: { color: '#0D0D0D', fontSize: 18, fontWeight: '900' },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
  },
  reactionsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  reactionBtn: { padding: 4 },
  reactionBtnText: { fontSize: 24 },
  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  participantCount: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.7,
    marginRight: 4,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  // Réactions animées
  reactionsOverlay: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    gap: 8,
  },
  reactionBubble: {
    fontSize: 28,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },

  // Modal mobile
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: BG,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalBack: { color: YELLOW, fontSize: 20, fontWeight: '700' },
  modalCurrentSong: {
    color: YELLOW,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  modalAddBtn: {
    backgroundColor: YELLOW,
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalAddBtnText: { color: '#0D0D0D', fontSize: 18, fontWeight: '900' },
  modalReactions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
});
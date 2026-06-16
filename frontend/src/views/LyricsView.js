/**
 * LyricsView.js
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView, StatusBar,
  FlatList, ScrollView, Modal, useWindowDimensions, Image, Animated,
} from 'react-native';
import styles from './viewStyles/LyricsView.styles';

// ─── Bulle de réaction animée ─────────────────────────────────────────────────
function ReactionBubble({ type }) {
  const opacity    = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 0,   duration: 2000, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -60, duration: 2000, useNativeDriver: true }),
    ]).start();
  }, []);

  const icon = 
    type === 'heart'
      ? require('../../assets/icon/icon_heart_karaoke.png')
      : type === 'fire'
      ? require('../../assets/icon/icon_confetti_karaoke.png')
      : require('../../assets/icon/icon_thumb_karaoke.png');

  return (
    <Animated.Image
      source={icon}
      style={[
        styles.reactionBubble,
        { opacity, transform: [{ translateY }] }
      ]}
      resizeMode="contain"
    />
  );
}

// ─── Avatar participant ───────────────────────────────────────────────────────
// Tableau d'avatars locaux — doit correspondre à tes assets/avatars/
// Adapte les require() selon les vrais noms de tes fichiers
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

function ParticipantAvatar({ participant, isSinging, isHost }) {
  const avatarSource = AVATARS[participant.avatarIndex ?? 0] ?? AVATARS[0];
  return (
    <View style={styles.avatarWrapper}>
      <View style={[styles.avatarCircle, isSinging && styles.avatarCircleSinging]}>
        <Image
          source={avatarSource}
          style={styles.avatarImage}
          resizeMode="cover"
        />
      </View>
      {isHost && (
        <View style={styles.avatarStarBadge}>
          <Text style={styles.avatarStarText}>⭐</Text>
        </View>
      )}
    </View>
  );
}

// ─── Item file d'attente ──────────────────────────────────────────────────────
function QueueItem({ item, index, isActive, isSelected, onPress }) {
  const title  = item?.titre  || item;
  const singer = item?.pseudo;
  return (
    <TouchableOpacity
      style={[styles.queueItem, isActive && styles.queueItemActive]}
      onPress={() => onPress(index)}
      activeOpacity={0.75}
    >
      <Text style={[styles.queueItemText, isActive && styles.queueItemTextActive]} numberOfLines={1}>
        {title}
      </Text>
      {singer ? (
        <Text style={styles.queueItemSinger} numberOfLines={1}>{singer}</Text>
      ) : null}
      {isSelected && (
        <View style={styles.skipInlineHint}>
          <Text style={styles.skipInlineHintText}>⏭ Voter pour skip</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Barre de vote skip (s'affiche sous la chanson sélectionnée) ──────────────
function SkipVoteBar({ skipVotes, totalParticipants, skipThreshold, onSkipVote }) {
  const voteCount = skipVotes?.size ?? 0;
  const needed    = Math.max(1, Math.ceil(totalParticipants * skipThreshold));
  const progress  = Math.min(voteCount / needed, 1);

  return (
    <View style={styles.skipBarContainer}>
      <View style={styles.skipBarRow}>
        <View style={styles.skipBarTrack}>
          <View style={[styles.skipBarFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.skipCount}>{voteCount}/{needed}</Text>
        <TouchableOpacity style={styles.skipBtn} onPress={onSkipVote}>
          <Text style={styles.skipBtnText}>⏭ Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── LyricsView ───────────────────────────────────────────────────────────────
export default function LyricsView({
  lyrics,
  lyricsLoading = false,
  lyricsError = null,
  currentLineIndex,
  currentSong,
  queue,
  reactions,
  participants,
  singerSocketId,
  role,
  skipVotes,
  totalParticipants,
  skipThreshold,
  selectedSongIndex,
  onReaction,
  onSkipVote,
  onOpenQueue,
  onScrollRef,
  onSelectSong,
}) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const [queueModalVisible, setQueueModalVisible] = useState(false);

  // ─── Paroles : ligne précédente + courante + suivante ─────────────────────
  const LyricsPanel = () => (
    <View style={styles.lyricsPanel}>
      {lyricsLoading ? (
        <Text style={styles.loadingText}>Chargement des paroles...</Text>
      ) : lyricsError ? (
        <Text style={styles.loadingText}>{lyricsError}</Text>
      ) : lyrics.length === 0 ? (
        <Text style={styles.loadingText}>Aucune parole disponible.</Text>
      ) : (
        [-1, 0, 1].map((offset) => {
          const index = currentLineIndex + offset;
          if (index < 0 || index >= lyrics.length) return null;
          return (
            <Text
              key={index}
              style={[
                styles.lyricLine,
                offset === 0  && styles.lyricLineCurrent,
                offset === -1 && styles.lyricLinePast,
                offset === 1  && styles.lyricLineNext,
              ]}
            >
              {lyrics[index].text}
            </Text>
          );
        })
      )}
    </View>
  );

  // ─── Colonne droite desktop ───────────────────────────────────────────────
  const RightColumn = () => (
    <View style={styles.rightColumn}>
      {/* File d'attente */}
      <ScrollView style={styles.queueScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.queuePanel}>
          {queue.map((item, index) => (
            <React.Fragment key={`${item?.titre || item}-${index}`}>
              <QueueItem
                item={item}
                index={index}
                isActive={index === 0}
                isSelected={selectedSongIndex === index}
                onPress={onSelectSong}
              />
              {selectedSongIndex === index && (
                <SkipVoteBar
                  skipVotes={skipVotes}
                  totalParticipants={totalParticipants}
                  skipThreshold={skipThreshold}
                  onSkipVote={onSkipVote}
                />
              )}
            </React.Fragment>
          ))}
        </View>
      </ScrollView>

      {/* Bas colonne droite : nb participants + avatars */}
      <View style={styles.rightFooter}>
        <View style={styles.participantCountContainer}>
          <Image
            source={require('../../assets/icon/icon_user_karaoke.png')}
            style={styles.participantIcon}
          />
          <Text style={styles.participantCountText}>{totalParticipants}</Text>
        </View>

        <View style={styles.avatarsRow}>
          {participants.map((p) => (
            <ParticipantAvatar
              key={p.userId}
              participant={p}
              isSinging={p.userId === singerSocketId}
              isHost={p.isHost}
            />
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      {isDesktop ? (
        // ── Layout desktop : côté gauche (paroles) + côté droit (tout en DARK) ──
        <View style={styles.desktopLayout}>

          {/* Gauche : header logo + paroles + footer réactions */}
          <View style={styles.leftSide}>
            <View style={styles.headerLeft}>
              <Image source={require('../../assets/logo/logo_karaoke.png')} style={styles.logo} resizeMode="contain" />
            </View>

            <ScrollView
              scrollEnabled={false}
              style={styles.lyricsPanelDesktop}
              contentContainerStyle={styles.lyricsPanelContent}
              showsVerticalScrollIndicator={false}
              ref={onScrollRef}
            >
              <LyricsPanel />
            </ScrollView>

            <View style={styles.footer}>
              <View style={styles.reactionsRow}>
                {['heart', 'fire', 'like'].map((type) => (
                  <TouchableOpacity style={styles.reactionBtn} onPress={() => onReaction(type)}>
                      <Image
                        source={
                          type === 'heart'
                            ? require('../../assets/icon/icon_heart_karaoke.png')
                            : type === 'fire'
                            ? require('../../assets/icon/icon_confetti_karaoke.png')
                            : require('../../assets/icon/icon_thumb_karaoke.png')
                        }
                        style={styles.reactionIcon}
                      />
                    </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Droite : header + bouton + queue + avatars — tout en #043049 */}
          <View style={styles.rightSide}>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.addBtn} onPress={onOpenQueue}>
                <Text style={styles.addBtnText}>＋</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.queueScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.queuePanel}>
                {queue.map((item, index) => (
                  <React.Fragment key={`${item?.titre || item}-${index}`}>
                    <QueueItem
                      item={item}
                      index={index}
                      isActive={index === 0}
                      isSelected={selectedSongIndex === index}
                      onPress={onSelectSong}
                    />
                    {selectedSongIndex === index && (
                      <SkipVoteBar
                        skipVotes={skipVotes}
                        totalParticipants={totalParticipants}
                        skipThreshold={skipThreshold}
                        onSkipVote={onSkipVote}
                      />
                    )}
                  </React.Fragment>
                ))}
              </View>
            </ScrollView>

            <View style={styles.rightFooter}>
              <View style={styles.participantCountContainer}>
              <Image
                source={require('../../assets/icon/icon_user_karaoke.png')}
                style={styles.participantIcon}
              />
              <Text style={styles.participantCountText}>{totalParticipants}</Text>
            </View>

              <View style={styles.avatarsRow}>
                {participants.map((p) => (
                  <ParticipantAvatar
                    key={p.userId}
                    participant={p}
                    isSinging={p.userId === singerSocketId}
                    isHost={p.isHost}
                  />
                ))}
              </View>
            </View>
          </View>

        </View>
      ) : (
        // ── Layout mobile ──────────────────────────────────────────────────────
        <>
          <View style={styles.header}>
            <Image source={require('../../assets/logo/logo_karaoke.png')} style={styles.logo} resizeMode="contain" />
            <TouchableOpacity style={styles.dotsBtn} onPress={() => setQueueModalVisible(true)}>
              <Text style={styles.dotsBtnText}>···</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            scrollEnabled={false}
            style={styles.lyricsPanelMobile}
            contentContainerStyle={styles.lyricsPanelContent}
            showsVerticalScrollIndicator={false}
            ref={onScrollRef}
          >
            <LyricsPanel />
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.reactionsRow}>
              {['heart', 'fire', 'like'].map((type) => (
                <TouchableOpacity key={type} style={styles.reactionBtn} onPress={() => onReaction(type)}>
                  <Image
                    source={
                      type === 'heart'
                        ? require('../../assets/icon/icon_heart_karaoke.png')
                        : type === 'fire'
                        ? require('../../assets/icon/icon_confetti_karaoke.png')
                        : require('../../assets/icon/icon_thumb_karaoke.png')
                    }
                    style={styles.reactionIcon}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.avatarsRow}>
              {participants.map((p) => (
                <ParticipantAvatar
                  key={p.userId}
                  participant={p}
                  isSinging={p.userId === singerSocketId}
                  isHost={p.isHost}
                />
              ))}
            </View>
          </View>
        </>
      )}

      {/* Bulles réactions */}
      <View style={{ position: 'absolute', bottom: 80, left: 20, gap: 8 }} pointerEvents="none">
        {reactions.map((r) => (
          <ReactionBubble key={r.id} type={r.type} />
        ))}
      </View>

      {/* Modal mobile */}
      <Modal visible={queueModalVisible} transparent animationType="slide" onRequestClose={() => setQueueModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setQueueModalVisible(false)}>
                <Text style={styles.modalBack}>{'<'}</Text>
              </TouchableOpacity>
              <Text style={styles.modalCurrentSong} numberOfLines={1}>{currentSong}</Text>
              <TouchableOpacity style={styles.modalAddBtn} onPress={onOpenQueue}>
                <Text style={styles.modalAddBtnText}>＋</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={queue}
              keyExtractor={(item, i) => `${item?.titre || item}-${i}`}
              renderItem={({ item, index }) => (
                <QueueItem
                  item={item}
                  index={index}
                  isActive={index === 0}
                  isSelected={selectedSongIndex === index}
                  onPress={onSelectSong}
                />
              )}
            />

            <View style={styles.modalReactions}>
              {['heart', 'fire', 'like'].map((type) => (
                <TouchableOpacity style={styles.reactionBtn} onPress={() => onReaction(type)}>

                  <Image
                    source={
                      type === 'heart'
                        ? require('../../assets/icon/icon_heart_karaoke.png')
                        : type === 'fire'
                        ? require('../../assets/icon/icon_confetti_karaoke.png')
                        : require('../../assets/icon/icon_thumb_karaoke.png')
                    }
                    style={styles.reactionIcon}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
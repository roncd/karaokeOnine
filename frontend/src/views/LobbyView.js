/**
 * LobbyView.js
 * Vue principale du salon — différente selon role ('host' | 'guest')
 * Host  : voit la file d'attente complète avec gestion
 * Guest : voit le catalogue et peut proposer une chanson
 */
import { API_URL } from '../config'
import Toast from '../components/Toast';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import styles from './viewStyles/LobbyView.styles';
import GlowStar from '../components/GlowStar';
import useTopSongs from '../hooks/useTopSongs';

// ─── Icône micro (sans emoji) ────────────────────────────────────────────────
function MicGlyph({ enabled }) {
  return (
    <View style={[styles.micGlyph, !enabled && styles.micGlyphMuted]}>
      <View style={styles.micGlyphHead} />
      <View style={styles.micGlyphArc} />
      <View style={styles.micGlyphStem} />
      {!enabled && <View style={styles.micGlyphSlash} />}
    </View>
  );
}

// ─── Bouton micro ────────────────────────────────────────────────────────────
function MicToggle({ micEnabled, onToggleMic, disabled }) {
  return (
    <TouchableOpacity
      style={[
        styles.micBar,
        micEnabled && styles.micBarOn,
        disabled && styles.micBarDisabled,
      ]}
      onPress={onToggleMic}
      activeOpacity={disabled ? 1 : 0.85}
      disabled={disabled}
    >
      <View style={[styles.micIndicator, micEnabled ? styles.micIndicatorOn : styles.micIndicatorOff]} />
      <View style={styles.micTextWrap}>
        <Text style={styles.micTitle}>{micEnabled ? 'Micro activé' : 'Micro coupé'}</Text>
        <Text style={styles.micSubtitle}>
          {disabled
            ? 'Active l\'audio du salon pour utiliser le micro'
            : micEnabled
              ? 'Les autres joueurs t\'entendent'
              : 'Appuie pour parler au salon'}
        </Text>
      </View>
      <MicGlyph enabled={micEnabled && !disabled} />
    </TouchableOpacity>
  );
}

// ─── Activation audio LiveKit ────────────────────────────────────────────────
function AudioPanel({ audioActive, livekitReady, activatingAudio, onActivateAudio }) {
  if (audioActive) {
    return (
      <View style={styles.audioStatusActive}>
        <View style={styles.audioStatusDotOn} />
        <Text style={styles.audioStatusActiveText}>Audio actif — tu entends et peux parler au salon</Text>
      </View>
    );
  }

  return (
    <View style={styles.audioPanel}>
      <View style={styles.audioStatusPending}>
        <View style={styles.audioStatusDotPending} />
        <Text style={styles.audioStatusPendingText}>En attente de ton clic</Text>
      </View>
   
      <TouchableOpacity
        style={[styles.audioActivateBtn, activatingAudio && styles.audioActivateBtnLoading]}
        onPress={onActivateAudio}
        activeOpacity={0.88}
        disabled={activatingAudio || !livekitReady}
      >
        {activatingAudio ? (
          <ActivityIndicator color="#0D0D0D" size="small" />
        ) : (
          <Text style={styles.audioActivateBtnText}>Activer l'audio</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

// ─── Logo étoile O'9 ────────────────────────────────────────────────────────
function StarLogo({ isHost }) {
  return (
    <Image
      source={require('../../assets/logo/logo_karaoke.png')}
      style={styles.logo}
    />
  );
}

// ─── Item de la file d'attente ───────────────────────────────────────────────
function QueueItemWithAvatar({ item, isHost, onDelete, onMoveUp, onMoveDown }) {
  const [showTooltip, setShowTooltip] = useState(false);

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

  return (
    <View style={styles.queueItemRow}>

      {/* BLOC DU MORCEAU */}
      <View style={styles.queueRow}>
        <Text style={[styles.queueTitle, styles.colTitle]}>{item.titre}</Text>
        <Text style={[styles.queueArtiste, styles.colArtist]}>{item.artiste}</Text>
        <Text style={[styles.queueGenre, styles.colGenre]}>{item.genre}</Text>
        <Text style={[styles.queueDuree, styles.colDuration]}>
          {Math.floor((item.duree || 0) / 60)}:
          {String((item.duree || 0) % 60).padStart(2, '0')}
        </Text>

        {isHost && (
          <View style={styles.hostActions}>
            <TouchableOpacity onPress={onMoveUp}>
              <Text style={styles.actionBtn}>↑</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onMoveDown}>
              <Text style={styles.actionBtn}>↓</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete}>
              <Text style={styles.actionBtn}>🗑</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* AVATAR À DROITE, EN DEHORS DU BLOC */}
      <TouchableOpacity
        style={styles.avatarOutside}
        onPressIn={() => setShowTooltip(true)}
        onPressOut={() => setShowTooltip(false)}
      >
        <Image
          source={AVATARS[item.avatarIndex || 0]}
          style={styles.queueAvatar}
        />

        {showTooltip && (
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>{item.pseudo}</Text>
          </View>
        )}
      </TouchableOpacity>

    </View>
  );
}

// ─── Toast notification ──────────────────────────────────────────────────────
// function Toast({ message, type }) {
//   if (!message) return null;
//   const isSuccess = type === 'success';
//   return (
//     <View style={[styles.toast, isSuccess ? styles.toastSuccess : styles.toastError]}>
//       <Text style={styles.toastIcon}>{isSuccess ? '✔' : '✖'}</Text>
//       <Text style={styles.toastText}>{message}</Text>
//     </View>
//   );
// }

// ─── Vue HÔTE : file d'attente ───────────────────────────────────────────────
function HostView({ lobbyId, queue, skipVotes, onVoteSkip, onAddSong, userCount, onStartSong, onDeleteSong, onMoveUp, onMoveDown, micEnabled, onToggleMic, audioActive, topSongs, topSongsLoading }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [songInput, setSongInput] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text) => {
    if (text.trim().length < 2) { setSongs([]); return; }
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/songs/search?titre=${encodeURIComponent(text)}`
      );
      const data = await res.json();
      setSongs(Array.isArray(data) ? data : []);
    } catch (err) {
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  const totalMinutes = queue.reduce((acc, song) => acc + (song.duree || 0), 0);
  const totalMinutesFormatted = Math.floor(totalMinutes / 60);
  const handleAdd = () => {
    if (!songInput.trim()) return;
    onAddSong(songInput);
    setSongInput('');
    setModalVisible(false);
  };

  return (
    <View style={styles.flex}>
      {/* Compteur */}
      <View style={styles.statsRow}>
        <Text style={styles.pageTitle}>File d'attente</Text>
        <View style={styles.statsSubRow}>
          <Text style={styles.statsText}>
            {queue.length} titre{queue.length !== 1 ? 's' : ''} - {totalMinutesFormatted} minutes
          </Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
      </View>

      {/* En-têtes */}
      <View style={styles.queueHeader}>
        <Text style={[styles.queueHeaderText, styles.colTitle]}>Titre</Text>
        <Text style={[styles.queueHeaderText, styles.colArtist]}>Artiste</Text>
        <Text style={[styles.queueHeaderText, styles.colGenre]}>Genre</Text>
        <Text style={[styles.queueHeaderText, styles.colDuration]}>Durée</Text>
        <Text style={[styles.queueHeaderText, styles.colGenre]}>Actions</Text>

      </View>

      {/* Liste */}
      {queue.length === 0 ? (
        <>
          <View style={[styles.emptyQueue, styles.emptyQueueWithStats]}>
            <Text style={styles.emptyText}>La file est vide</Text>
            <Text style={styles.emptyHint}>Ajoutez une chanson pour commencer !</Text>
          </View>
        </>
      ) : (
        <FlatList
          data={queue}
          keyExtractor={(item, i) => `${item.id || i}-${i}`}
          renderItem={({ item, index }) => (
            <QueueItemWithAvatar
              item={item}
              index={index}
              isHost
              onDelete={() => onDeleteSong(index)}
              onMoveUp={() => onMoveUp(index)}
              onMoveDown={() => onMoveDown(index)}
            />
          )}
          style={styles.flex}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Lancer la chanson */}
      {queue.length > 0 && (
        <TouchableOpacity style={styles.startSongBtn} onPress={onStartSong}>
          <Text style={styles.startSongBtnText}>▶ Lancer la chanson</Text>
        </TouchableOpacity>
      )}

      <MicToggle
        micEnabled={micEnabled}
        onToggleMic={onToggleMic}
        disabled={!audioActive}
      />

      {/* Modal ajout chanson */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ajouter une chanson</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Barre de recherche */}
            <TextInput
              style={styles.searchInput}
              value={songInput}
              onChangeText={(text) => {
                setSongInput(text);
                handleSearch(text);
              }}
              placeholder="Rechercher un titre ou artiste..."
              placeholderTextColor="#555"
              autoFocus
            />

            {/* Liste */}
            {loading ? (
              <ActivityIndicator color="#F5E642" style={{ marginTop: 24 }} />
            ) : songs.length === 0 ? (
              <Text style={styles.emptyText}>
                {songInput.length < 2 ? 'Tapez pour rechercher...' : 'Aucune chanson trouvée'}
              </Text>
            ) : (
              <FlatList
                data={songs}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.songItem}
                    onPress={() => {
                      onAddSong(item.titre);
                      setModalVisible(false);
                      setSongInput('');
                      setSongs([]);
                    }}
                  >
                    <View style={styles.songItemInfo}>
                      <Text style={styles.songItemTitle}>{item.titre}</Text>
                      <Text style={styles.songItemArtiste}>{item.artiste}</Text>
                    </View>
                    <View style={styles.songItemAction}>
                      <Text style={styles.songItemGenre}>{item.genre}</Text>
                      <View style={styles.songItemAddBtn}>
                        <Text style={styles.songItemAddText}>Proposer</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                style={styles.songList}
              />
            )}

          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Vue PARTICIPANT : catalogue ─────────────────────────────────────────────
const GENRES = [
  { label: 'Pop', short: 'POP', accent: '#F5E642' },
  { label: 'Hip-Hop', short: 'HH', accent: '#7DD3FC' },
  { label: 'R&B', short: 'R&B', accent: '#C4B5FD' },
  { label: 'Soul', short: 'SOUL', accent: '#FDBA74' },
  { label: 'Funk', short: 'FUNK', accent: '#86EFAC' },
  { label: 'Variété française', short: 'FR', accent: '#FCA5A5' },
];

function GuestView({ queue, skipVotes, onVoteSkip, onAddSong, micEnabled, onToggleMic, audioActive, topSongs, topSongsLoading }) {
  const { width } = useWindowDimensions();
  const cardWidth = width >= 900 ? '31.5%' : width >= 640 ? '47%' : '100%';
  const [songs, setSongs] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Charger les chansons d'un genre
  const handleGenrePress = async (genre) => {
    setSelectedGenre(genre);
    setLoading(true);
    setModalVisible(true);
    try {
      const res = await fetch(
        `${API_URL}/api/songs/search?genre=${encodeURIComponent(genre)}`
      );
      const data = await res.json();
      setSongs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Erreur chargement catalogue :', err.message);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (text) => {
    setSearchText(text);
    if (text.trim().length < 2) {
      setSongs([]); return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/songs/search?titre=${encodeURIComponent(text)}`
      );
      const data = await res.json();
      setSongs(Array.isArray(data) ? data : []);
    } catch (err) {
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  // Ouvrir la recherche globale
  const handleOpenSearch = async () => {
    setSelectedGenre(null);
    setSearchText('');
    setLoading(true);
    setModalVisible(true);
    setSearching(true);
    try {
      const res = await fetch(`${API_URL}/api/songs`);
      const data = await res.json();
      setSongs(Array.isArray(data) ? data : []);
    } catch (err) {
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSong = (song) => {
    onAddSong(song.titre);
    setModalVisible(false);
    setSearching(false);
    setSearchText('');
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSearching(false);
    setSearchText('');
  };

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.catalogueScroll}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.catalogueHero}>
        <GlowStar
          size={44}
          opacity={0.3}
          floatY={6}
          style={styles.heroStar}
        />
        <Text style={styles.catalogueTitle}>Catalogue</Text>
        <Text style={styles.catalogueSubtitle}>
          Choisis un genre ou cherche un titre à proposer au salon
        </Text>
      </View>

      <TouchableOpacity
        style={styles.searchBar}
        onPress={handleOpenSearch}
        activeOpacity={0.85}
      >
        <Text style={styles.searchBarIcon}>⌕</Text>
        <Text style={styles.searchBarText}>Rechercher une chanson...</Text>
      </TouchableOpacity>

      <View style={styles.genreSectionHeader}>
        <Text style={styles.genreSectionTitle}>Genres</Text>
        <Text style={styles.genreSectionCount}>{GENRES.length} styles</Text>
      </View>

      <View style={styles.genreGrid}>
        {GENRES.map((g) => (
          <TouchableOpacity
            key={g.label}
            style={[
              styles.genreCard,
              { width: cardWidth, borderColor: `${g.accent}44` },
            ]}
            onPress={() => handleGenrePress(g.label)}
            activeOpacity={0.88}
          >
            <View style={[styles.genreAccent, { backgroundColor: g.accent }]} />
            <View style={[styles.genreIconWrap, { backgroundColor: `${g.accent}18`, borderColor: `${g.accent}55` }]}>
              <Text style={[styles.genreShort, { color: g.accent }]}>{g.short}</Text>
            </View>
            <Text style={styles.genreLabel}>{g.label}</Text>
            <Text style={[styles.genreExplore, { color: g.accent }]}>Explorer →</Text>
          </TouchableOpacity>
        ))}
      </View>

      <MicToggle
        micEnabled={micEnabled}
        onToggleMic={onToggleMic}
        disabled={!audioActive}
      />

      {/* Modal liste de chansons */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            {/* Header modal */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedGenre ?? 'Toutes les chansons'}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Barre de recherche */}
            <TextInput
              style={styles.searchInput}
              value={searchText}
              onChangeText={handleSearch}
              placeholder="Rechercher un titre ou artiste..."
              placeholderTextColor="#555"
              autoFocus={searching}
            />

            {/* Liste de chansons */}
            {loading ? (
              <ActivityIndicator color="#F5E642" style={{ marginTop: 24 }} />
            ) : songs.length === 0 ? (
              <Text style={styles.emptyText}>Aucune chanson trouvée</Text>
            ) : (
              <FlatList
                data={songs}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.songItem}
                    onPress={() => handleSelectSong(item)}
                  >
                    <View style={styles.songItemInfo}>
                      <Text style={styles.songItemTitle} numberOfLines={1}>
                        {item.titre}
                      </Text>
                      <Text style={styles.songItemArtiste} numberOfLines={1}>
                        {item.artiste}
                      </Text>
                    </View>
                    <View style={styles.songItemAction}>
                      <Text style={styles.songItemGenre}>{item.genre}</Text>
                      <View style={styles.songItemAddBtn}>
                        <Text style={styles.songItemAddText}>Proposer</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                style={styles.songList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}


// ─── LobbyView principal ─────────────────────────────────────────────────────
export default function LobbyView({
  lobbyId,
  role,
  isConnected,
  queue,
  skipVotes,
  userCount,
  toast,
  onAddSong,
  onVoteSkip,
  onLeave,
  onStartSong,
  onDeleteSong,
  onMoveUp,
  onMoveDown,
  micEnabled,
  onToggleMic,
  audioActive,
  livekitReady,
  activatingAudio,
  onActivateAudio,
}) {
  const isHost = role === 'host';
  const { topSongs, loading: topSongsLoading } = useTopSongs();

  return (
    <>
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          <StarLogo isHost={isHost} />
          <View style={styles.headerCenter}>
            <Text style={styles.lobbyCode}>{lobbyId}</Text>
            <View style={[styles.dot, isConnected ? styles.dotOnline : styles.dotOffline]} />
          </View>
          <TouchableOpacity onPress={onLeave}>
            <Text style={styles.leaveText}>Quitter</Text>
          </TouchableOpacity>
        </View>

        <AudioPanel
          audioActive={audioActive}
          livekitReady={livekitReady}
          activatingAudio={activatingAudio}
          onActivateAudio={onActivateAudio}
        />

        {/* Contenu selon rôle */}
        <View style={styles.content}>
          {isHost ? (
            <HostView
              lobbyId={lobbyId}
              queue={queue}
              skipVotes={skipVotes}
              onVoteSkip={onVoteSkip}
              onAddSong={onAddSong}
              userCount={userCount}
              onStartSong={onStartSong}
              onDeleteSong={onDeleteSong}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              micEnabled={micEnabled}
              onToggleMic={onToggleMic}
              audioActive={audioActive}
              topSongs={topSongs}
              topSongsLoading={topSongsLoading}
            />
          ) : (
            <GuestView
              queue={queue}
              skipVotes={skipVotes}
              onVoteSkip={onVoteSkip}
              onAddSong={onAddSong}
              onStartSong={onStartSong}
              micEnabled={micEnabled}
              onToggleMic={onToggleMic}
              audioActive={audioActive}
              topSongs={topSongs}
              topSongsLoading={topSongsLoading}
            />
          )}
        </View>
      </SafeAreaView>
      {toast ? <Toast {...toast} /> : null}
    </>
  );
}

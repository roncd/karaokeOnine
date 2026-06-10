/**
 * LobbyView.js
 * Vue principale du salon — différente selon role ('host' | 'guest')
 * Host  : voit la file d'attente complète avec gestion
 * Guest : voit le catalogue et peut proposer une chanson
 */
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
} from 'react-native';

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
function QueueItem({ title, index, isHost }) {
  return (
    <View style={styles.queueItem}>
      <View style={styles.queueItemLeft}>
        <Text style={styles.queueIndex}>{index + 1}</Text>
        <Text style={styles.queueTitle} numberOfLines={1}>{title.titre}</Text>
      </View>
       <Text style={styles.queueArtiste} numberOfLines={1}>{title.artiste}</Text>
        {/* <Text style={styles.queueGenre} numberOfLines={1}>{title.genre}</Text> */}
        <Text style={styles.queueDuree} numberOfLines={1}>{Math.floor((title.duree || 0) / 60)}:{String((title.duree || 0) % 60).padStart(2, '0')}</Text>
        {isHost && (
          <TouchableOpacity style={styles.queueDots}>
            <Text style={styles.queueDotsText}>···</Text>
          </TouchableOpacity>
        )}
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
function HostView({ lobbyId, queue, skipVotes, onVoteSkip, onAddSong, userCount, onStartSong }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [songInput, setSongInput]       = useState('');
  const [songs, setSongs]               = useState([]);
  const [loading, setLoading]           = useState(false);
  
  const handleSearch = async (text) => {
    if (text.trim().length < 2) { setSongs([]); return; }
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/songs/search?titre=${encodeURIComponent(text)}`
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

      {/* En-têtes */}
      <View style={styles.queueHeader}>
        <Text style={styles.queueHeaderText}>Titre</Text>
        <Text style={styles.queueHeaderText}>Artiste</Text>
        {/* <Text style={styles.queueHeaderText}>Genre</Text> */}
        <Text style={styles.queueHeaderText}>Durée</Text>
      </View>

      {/* Liste */}
      {queue.length === 0 ? (
        <View style={styles.emptyQueue}>
          <Text style={styles.emptyText}>La file est vide</Text>
          <Text style={styles.emptyHint}>Ajoutez une chanson pour commencer !</Text>
        </View>
      ) : (
        <FlatList
          data={queue}
          keyExtractor={(item, i) => `${item}-${i}`}
          renderItem={({ item, index }) => (
            <QueueItem title={item} index={index} isHost />
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


      {/* Vote skip */}
      {queue.length > 0 && (
        <TouchableOpacity style={styles.skipBtn} onPress={onVoteSkip}>
          <Text style={styles.skipBtnText}>⏭ Passer ({skipVotes}/2)</Text>
        </TouchableOpacity>
      )}

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
                // Je pense pas que ce texte est important,on peut le retirer puisqu'il y a les toast
                <Text style={styles.emptyText}>
                  {songInput.length < 2 ? 'Tapez pour rechercher...' : 'Aucune chanson trouvée'}
                </Text>
                // Regler le probleme avec les toast
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
                      <Text style={styles.songItemGenre}>{item.genre}</Text>
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
const API_URL = 'http://localhost:3000/api';

const GENRES = [
  { label: 'Pop',               emoji: '🎵' },
  { label: 'Rock',              emoji: '🎸' },
  // { label: 'Hip-Hop',           emoji: '🎤' },
  { label: 'R&B',               emoji: '🎶' },
  { label: 'Soul',              emoji: '🎼' },
  { label: 'Funk',              emoji: '🕺' },
  { label: 'Variété française', emoji: '🇫🇷' },
  //bug avec les accents dans les genres, à régler plus tard
  //taille de la page a regler, bug
  //emoji a retirer
];

function GuestView({ queue, skipVotes, onVoteSkip, onAddSong }) {
  const [songs, setSongs]               = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchText, setSearchText]     = useState('');
  const [searching, setSearching]       = useState(false);
  const [loading, setLoading]           = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Charger les chansons d'un genre
  const handleGenrePress = async (genre) => {
    setSelectedGenre(genre);
    setLoading(true);
    setModalVisible(true);
    try {
      const res = await fetch(
        `${API_URL}/songs/search?genre=${encodeURIComponent(genre)}`
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
        `http://localhost:3000/api/songs/search?titre=${encodeURIComponent(text)}`
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
      const res = await fetch(`${API_URL}/songs`);
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
    onAddSong(song.artiste);
    onAddSong(song.genre);
    onAddSong(song.duree);
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
    <View style={styles.flex}>

      {/* Titre catalogue */}
      <View style={styles.catalogueHeader}>
        <Text style={styles.catalogueTitle}>Catalogue</Text>
        {/* <TouchableOpacity onPress={handleOpenSearch}>
          <Text style={styles.searchIcon}>🔍</Text>
        </TouchableOpacity> */}
      </View>

      {/* Grille genres */}
      <View style={styles.genreGrid}>
        {GENRES.map((g) => (
          <TouchableOpacity
            key={g.label}
            style={styles.genreCard}
            onPress={() => handleGenrePress(g.label)}
          >
            <Text style={styles.genreEmoji}>{g.emoji}</Text>
            <Text style={styles.genreLabel}>{g.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Vote skip */}
      {queue.length > 0 && (
        <TouchableOpacity style={styles.skipBtn} onPress={onVoteSkip}>
          <Text style={styles.skipBtnText}>⏭ Passer ({skipVotes}/2)</Text>
        </TouchableOpacity>
      )}

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
                    <Text style={styles.songItemGenre}>{item.genre}</Text>
                  </TouchableOpacity>
                )}
                style={styles.songList}
                showsVerticalScrollIndicator={false}
              />
            )}

          </View>
        </View>
      </Modal>

    </View>
  );
}


// ─── LobbyView principal ─────────────────────────────────────────────────────
export default function LobbyView({
  lobbyId,
  role,
  isConnected,
  queue,
  skipVotes,
  skippedSong,
  userCount,
  toastMessage,
  onAddSong,
  onVoteSkip,
  onLeave,
  onStartSong,
}) {
  const isHost = role === 'host';

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

      {/* Toast chanson skippée */}
      {skippedSong && (
        <Toast message={`"${skippedSong}" passé`} type="success" />
      )}

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
          />
        ) : (
          <GuestView
            queue={queue}
            skipVotes={skipVotes}
            onVoteSkip={onVoteSkip}
            onAddSong={onAddSong}
            onStartSong={onStartSong}
          />
        )}
      </View>
    </SafeAreaView>
    <Toast message={toastMessage} type="error" />
    </>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const YELLOW = '#F5E642';
const BG     = '#0B3D5E';
const CARD   = '#0D4D72';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  flex: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },

  logo: {
  width: 60,
  height: 60,
  resizeMode: 'contain',
},

  hostBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: YELLOW,
    marginLeft: 4,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lobbyCode: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOnline:  { backgroundColor: '#4ADE80' },
  dotOffline: { backgroundColor: '#EF4444' },
  leaveText: {
    color: '#888',
    fontSize: 13,
  },

  // Contenu
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  // Toast
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 8,
    padding: 14,
    borderRadius: 12,
    gap: 10,
  },
  toastSuccess: { backgroundColor: YELLOW },
  toastError:   { backgroundColor: YELLOW },
  toastIcon: { fontSize: 16, color: '#0D0D0D', fontWeight: '900' },
  toastText: { color: '#0D0D0D', fontWeight: '700', fontSize: 14 },

  // Host — file d'attente
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statsText: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.6,
  },
  addBtn: {
    backgroundColor: YELLOW,
    width: 36,
    height: 36,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#0D0D0D',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 22,
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  queueHeaderText: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.4,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CARD,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  queueItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  queueIndex: {
    color: YELLOW,
    fontWeight: '800',
    fontSize: 14,
    width: 20,
  },
  queueTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  queueDots: { paddingLeft: 8 },
  queueDotsText: { color: '#888', fontSize: 18, letterSpacing: 2 },
  queueCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  emptyQueue: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: { color: '#fff', fontSize: 16, fontWeight: '700', opacity: 0.5 },
  emptyHint: { color: '#fff', fontSize: 13, opacity: 0.3 },

  // Skip
  skipBtn: {
    borderWidth: 1.5,
    borderColor: YELLOW,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  skipBtnText: {
    color: YELLOW,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
  },

  // Guest — catalogue
  catalogueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  catalogueTitle: {
    color: YELLOW,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
  },
  searchIcon: { fontSize: 20 },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  genreCard: {
    width: '47%',
    backgroundColor: CARD,
    borderRadius: 12,
    paddingVertical: 32,
    alignItems: 'center',
    gap: 8,
  },
  genreEmoji: { fontSize: 32 },
  genreLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },

  queueArtiste: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.5,
    flex: 1,
  },
  queueGenre: {
    color: YELLOW,
    fontSize: 11,
    opacity: 0.7,
    marginHorizontal: 4,
  },
  queueDuree: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.5,
    marginRight: 8,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalBox: {
    backgroundColor: '#0D3D5C',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 16,
  },
  modalTitle: {
    color: YELLOW,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: YELLOW,
    borderRadius: 8,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  modalCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  modalCancelText: { color: '#888', fontWeight: '600', fontSize: 15 },
  modalConfirm: {
    flex: 1,
    backgroundColor: YELLOW,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalConfirmText: { color: '#0D0D0D', fontWeight: '800', fontSize: 15 },

  // Ajouter ces styles dans StyleSheet.create({}) de LobbyView.js

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalClose: {
    color: '#888',
    fontSize: 18,
    padding: 4,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: 'rgba(245,230,66,0.4)',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 12,
  },
  songList: {
    maxHeight: 320,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  songItemInfo: {
    flex: 1,
    gap: 2,
  },
  songItemTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  songItemArtiste: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.5,
  },
  songItemGenre: {
    color: '#F5E642',
    fontSize: 11,
    opacity: 0.7,
    marginLeft: 8,
  },
  emptyText: {
    color: '#fff',
    opacity: 0.4,
    textAlign: 'center',
    marginTop: 24,
    fontSize: 14,
  },

  startSongBtn: {
  backgroundColor: YELLOW,
  borderRadius: 8,
  paddingVertical: 14,
  alignItems: 'center',
  marginTop: 12,
},
startSongBtnText: {
  color: '#0D0D0D',
  fontWeight: '800',
  fontSize: 14,
  letterSpacing: 1,
},
});
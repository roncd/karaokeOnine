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
} from 'react-native';
import styles from './viewStyles/LobbyView.styles';

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
function HostView({ lobbyId, queue, skipVotes, onVoteSkip, onAddSong, userCount, onStartSong, onDeleteSong, onMoveUp, onMoveDown, micEnabled, onToggleMic }) {
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
        <View style={styles.emptyQueue}>
          <Text style={styles.emptyText}>La file est vide</Text>
          <Text style={styles.emptyHint}>Ajoutez une chanson pour commencer !</Text>
        </View>
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

      <TouchableOpacity onPress={onToggleMic}>
        <Text>{micEnabled ? "🎤 Micro ON" : "🔇 Micro OFF"}</Text>
      </TouchableOpacity>

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
const GENRES = [
  { label: 'Pop', emoji: '🎵' },
//  { label: 'Rock', emoji: '🎸' },
  { label: 'Hip-Hop', emoji: '🎤' },
  { label: 'R&B', emoji: '🎶' },
  { label: 'Soul', emoji: '🎼' },
  { label: 'Funk', emoji: '🕺' },
  { label: 'Variété française', emoji: '🇫🇷' },
  //bug avec les accents dans les genres, à régler plus tard
  //taille de la page a regler, bug
  //emoji a retirer
];

function GuestView({ queue, skipVotes, onVoteSkip, onAddSong, micEnabled, onToggleMic }) {
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

      <TouchableOpacity onPress={onToggleMic}>
        <Text>{micEnabled ? "🎤 Micro ON" : "🔇 Micro OFF"}</Text>
      </TouchableOpacity>

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
  onDeleteSong,
  onMoveUp,
  onMoveDown,
  micEnabled,
  onToggleMic,
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
              onDeleteSong={onDeleteSong}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
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

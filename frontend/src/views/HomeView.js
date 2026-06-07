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

export default function HomeView({ onCreateLobby, onJoinLobby }) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      {/* Logo */}
      <Image 
        source={require('../../assets/logo/logo_karaoke.png')} 
        style={styles.logo}
      />

      <View style={styles.container}>

        {/* Décorations */}
        <Text style={styles.decoNoteTop}>♪</Text>
        <Text style={styles.decoPlus1}>+</Text>
        <Text style={styles.decoPlus2}>+</Text>
        <View style={styles.decoBlob1} />
        <View style={styles.decoBlob2} />
        <Text style={styles.decoNoteBottom}>♫</Text>

        {/* Titre */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>KARAOKE O'NINE</Text>
          <Text style={styles.subtitle}>Ici, tout le monde est une star</Text>
        </View>

        {/* Boutons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={onCreateLobby}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Créer un salon</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            onPress={onJoinLobby}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Rejoindre un salon</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const YELLOW = '#F5E642';
const BG     = '#0B3D5E';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  logo: {
  width: 60,
  height: 60,
  resizeMode: 'contain',
},
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingBottom: 60,
    paddingTop: 20,
  },

  // Décorations
  decoNoteTop: {
    position: 'absolute',
    top: 30,
    right: 40,
    fontSize: 40,
    color: YELLOW,
    opacity: 0.9,
  },
  decoPlus1: {
    position: 'absolute',
    top: 60,
    left: 50,
    fontSize: 22,
    color: YELLOW,
    opacity: 0.7,
  },
  decoPlus2: {
    position: 'absolute',
    top: 200,
    left: 30,
    fontSize: 18,
    color: YELLOW,
    opacity: 0.5,
  },
  decoBlob1: {
    position: 'absolute',
    bottom: 180,
    left: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3A7D44',
    opacity: 0.35,
  },
  decoBlob2: {
    position: 'absolute',
    bottom: 240,
    left: 10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3A7D44',
    opacity: 0.2,
  },
  decoNoteBottom: {
    position: 'absolute',
    bottom: 120,
    right: 30,
    fontSize: 52,
    color: YELLOW,
    opacity: 0.95,
  },

  // Titre
  titleBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 4,
    color: YELLOW,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 4,
  },

  // Boutons
  buttonGroup: {
    width: '100%',
    gap: 14,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 8,
  },
  buttonPrimary: {
    backgroundColor: YELLOW,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#0D0D0D',
  },
});
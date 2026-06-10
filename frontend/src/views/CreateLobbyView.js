import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  TextInput
} from 'react-native';
import AvatarPicker from '../components/AvatarPicker';

export default function CreateLobbyView({ lobbyId, onBack, onShare, onStart, pseudo, onChangePseudo, avatarIndex, onSelectAvatar }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Logo */}
        <Image
          source={require('../../assets/logo/logo_karaoke.png')}
          style={styles.logo}
        />

        {/* Titre */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Créer un salon</Text>
          <Text style={styles.subtitle}>Générez un code unique à 6 chiffres</Text>
        </View>

        {/* Code */}
        <View style={styles.idBlock}>
          {lobbyId ? (
            <View style={styles.codeRow}>
              <Text style={styles.codeText}>{lobbyId}</Text>
              <TouchableOpacity onPress={onShare} style={styles.copyBtn}>
                <Text style={styles.copyIcon}>⧉</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ActivityIndicator color="#F5E642" size="large" />
          )}
        </View>

        {/* Pseudo */}
        <View style={styles.titleBlock}>
          <Text style={{ color: '#fff', opacity: 0.7 }}>Votre pseudo</Text>
        </View>

        <View style={styles.idBlock}>
          <TextInput
            style={styles.pseudoInput}
            value={pseudo}
            onChangeText={onChangePseudo}
            placeholder="Entrez votre pseudo"
            placeholderTextColor="rgba(255,255,255,0.3)"
          />
        </View>

        {/* Avatar */}
        <View style={styles.titleBlock}>
          <Text style={{ color: '#fff', opacity: 0.7 }}>Votre avatar</Text>
        </View>
        <AvatarPicker selected={avatarIndex} onSelect={onSelectAvatar} />

        {/* Boutons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.generateBtn}
            onPress={onShare}
            activeOpacity={0.8}
          >
            <Text style={styles.generateBtnText}>Générer</Text>
          </TouchableOpacity>

          {onStart && (
            <TouchableOpacity
              style={styles.startBtn}
              onPress={onStart}
              activeOpacity={0.8}
            >
              <Text style={styles.startBtnText}>Démarrer le salon</Text>
            </TouchableOpacity>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}

const YELLOW = '#F5E642';
const BG = '#0B3D5E';
const CARD = '#0D4D72';

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 15,
  },

  // Logo
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },

  // Titre
  titleBlock: {
    gap: 8,
    marginTop: 16,
  },
  title: {
    color: YELLOW,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.7,
  },

  // Code
  idBlock: {
    justifyContent: 'center',
    gap: 12,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: YELLOW,
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 10,
    paddingHorizontal: 24,
    gap: 16,
    backgroundColor: CARD,
    width: '100%',
    justifyContent: 'space-between',
  },
  codeText: {
    color: YELLOW,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 10,
  },
  copyBtn: {
    padding: 4,
  },
  copyIcon: {
    color: YELLOW,
    fontSize: 22,
  },

  // Pseudo avatar
  pseudoInput: {
    borderWidth: 1,
    borderColor: 'rgba(245,230,66,0.4)',
    borderRadius: 8,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 12,
  },

  // Boutons
  actions: {
    gap: 12,
  },
  generateBtn: {
    backgroundColor: YELLOW,
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  generateBtnText: {
    color: '#0D0D0D',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 1,
  },
  startBtn: {
    borderWidth: 1.5,
    borderColor: YELLOW,
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  startBtnText: {
    color: YELLOW,
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 1,
  },
});
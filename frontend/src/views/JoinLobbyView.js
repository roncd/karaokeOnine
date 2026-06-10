/**
 * JoinLobbyView.js
 * Permet de saisir un code de salon à 6 caractères
 */
import Toast from '../components/Toast';
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
} from 'react-native';
import AvatarPicker from '../components/AvatarPicker';

export default function JoinLobbyView({ inputId, onChangeId, onJoin, onBack, error, loading, pseudo, onChangePseudo, avatarIndex, onSelectAvatar }) {
  return (
    <>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.container}>

            {/* Logo */}
            <Image
              source={require('../../assets/logo/logo_karaoke.png')}
              style={styles.logo}
            />

            {/* Titre */}
            <View style={styles.titleBlock}>
              <Text style={styles.title}>Rejoindre un salon</Text>
              <Text style={styles.subtitle}>Entrez un code d'accès à 6 chiffres</Text>
            </View>

            {/* Input */}
            <View style={styles.inputBlock}>
              <TextInput
                style={[styles.input, error ? styles.inputError : null]}
                value={inputId}
                onChangeText={onChangeId}
                placeholder="------"
                placeholderTextColor="rgba(245,230,66,0.3)"
                maxLength={6}
                autoCapitalize="characters"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={onJoin}
              />

              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}
            </View>
            <View style={styles.titleBlock}>
              {/* Pseudo */}
              <Text style={{ color: '#fff', opacity: 0.7 }}>Votre pseudo</Text>
            </View>

            <View style={styles.inputBlock}>
              <TextInput
                style={styles.pseudoInput}
                value={pseudo}
                onChangeText={onChangePseudo}
                placeholder="Entrez votre pseudo"
                placeholderTextColor="rgba(255,255,255,0.3)"
              />
            </View>

            <View style={styles.titleBlock}>
              {/* Avatar */}
              <Text style={{ color: '#fff', opacity: 0.7, marginVertical: 12 }}>Votre avatar</Text>
            </View>
            <AvatarPicker selected={avatarIndex} onSelect={onSelectAvatar} />

            {/* Bouton valider */}
            <TouchableOpacity
              style={[
                styles.joinBtn,
                inputId.length !== 6 && styles.joinBtnDisabled,
              ]}
              onPress={onJoin}
              disabled={inputId.length !== 6 || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#0D0D0D" />
              ) : (
                <Text style={styles.joinBtnText}>Valider</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <Toast message={error === 'full' ? 'Veuillez essayer un autre code.' : ''} type="full" />
    </>
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
  flex: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
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

  // Input
  inputBlock: {
    justifyContent: 'center',
    gap: 12,
  },
  input: {
    borderWidth: 1.5,
    borderColor: YELLOW,
    borderRadius: 8,
    color: YELLOW,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 16,
    textAlign: 'center',
    paddingVertical: 10,
    marginVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: CARD,
  },
  inputError: {
    borderColor: '#FF4D4D',
  },
  errorText: {
    color: '#FF4D4D',
    fontSize: 13,
    textAlign: 'center',
  },

  // pseudo avatar
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
  // Bouton
  joinBtn: {
    backgroundColor: YELLOW,
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinBtnDisabled: {
    opacity: 0.35,
  },
  joinBtnText: {
    color: '#0D0D0D',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 1,
    marginTop:10
  },
});
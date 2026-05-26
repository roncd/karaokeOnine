/**
 * JoinLobbyView.js
 * Lets the user type a 6-character lobby ID to join
 */

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
} from 'react-native';

export default function JoinLobbyView({ inputId, onChangeId, onJoin, onBack, error }) {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.screenTitle}>Join Lobby</Text>
            <View style={{ width: 60 }} />
          </View>

          {/* Input area */}
          <View style={styles.inputBlock}>
            <Text style={styles.label}>ENTER LOBBY CODE</Text>

            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              value={inputId}
              onChangeText={onChangeId}
              placeholder="A1B2C3"
              placeholderTextColor="#333"
              maxLength={6}
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={onJoin}
            />

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <Text style={styles.hint}>6 letters / numbers, e.g. K9F2XA</Text>
            )}
          </View>

          {/* Join button */}
          <TouchableOpacity
            style={[
              styles.joinBtn,
              inputId.length !== 6 && styles.joinBtnDisabled,
            ]}
            onPress={onJoin}
            disabled={inputId.length !== 6}
            activeOpacity={0.8}
          >
            <Text style={styles.joinBtnText}>Join →</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  flex: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: { width: 60 },
  backText: { color: '#888', fontSize: 15 },
  screenTitle: {
    color: '#F5E642',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  inputBlock: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  label: {
    color: '#555',
    fontSize: 11,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#F5E642',
    borderRadius: 4,
    color: '#F5E642',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 14,
    textAlign: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#141414',
  },
  inputError: {
    borderColor: '#FF4D4D',
  },
  hint: {
    color: '#444',
    fontSize: 12,
    letterSpacing: 1,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF4D4D',
    fontSize: 13,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  joinBtn: {
    backgroundColor: '#F5E642',
    paddingVertical: 18,
    borderRadius: 4,
    alignItems: 'center',
  },
  joinBtnDisabled: {
    opacity: 0.3,
  },
  joinBtnText: {
    color: '#0D0D0D',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});

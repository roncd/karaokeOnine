/**
 * CreateLobbyView.js
 * Displays the generated lobby ID and a share / start option
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

export default function CreateLobbyView({ lobbyId, onBack, onShare }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>New Lobby</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* ID display */}
        <View style={styles.idBlock}>
          <Text style={styles.label}>YOUR LOBBY CODE</Text>

          {lobbyId ? (
            <View style={styles.codeRow}>
              {lobbyId.split('').map((char, i) => (
                <View key={i} style={styles.charBox}>
                  <Text style={styles.charText}>{char}</Text>
                </View>
              ))}
            </View>
          ) : (
            <ActivityIndicator color="#F5E642" size="large" />
          )}

          <Text style={styles.hint}>Share this code with your friends</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.shareBtn}
            onPress={onShare}
            activeOpacity={0.8}
          >
            <Text style={styles.shareBtnText}>Share Code</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
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
  idBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  label: {
    color: '#555',
    fontSize: 11,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  codeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  charBox: {
    width: 48,
    height: 64,
    borderWidth: 1.5,
    borderColor: '#F5E642',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  charText: {
    color: '#F5E642',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0,
  },
  hint: {
    color: '#555',
    fontSize: 13,
    letterSpacing: 1,
  },
  actions: {
    gap: 12,
  },
  shareBtn: {
    backgroundColor: '#F5E642',
    paddingVertical: 18,
    borderRadius: 4,
    alignItems: 'center',
  },
  shareBtnText: {
    color: '#0D0D0D',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});

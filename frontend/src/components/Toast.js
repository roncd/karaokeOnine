/**
 * Toast.js
 * Composant toast réutilisable
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

const YELLOW = '#F5E642';

export default function Toast({ message, type = 'success' }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!message) return;
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2500),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [message]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <Animated.View style={[styles.toast, { opacity }]}>
      <Text style={styles.icon}>{isSuccess ? '✔' : '✖'}</Text>
      <View>
        <Text style={styles.title}>
          {isSuccess ? 'Vote enregistré' : type === 'full' ? 'Salon plein' : 'Morceau introuvable'}
        </Text>
        <Text style={styles.subtitle}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 60,
    left: 24,
    right: 24,
    backgroundColor: YELLOW,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    zIndex: 999,
    elevation: 8,
  },
  icon: { fontSize: 20, color: '#0D0D0D', fontWeight: '900' },
  title: { color: '#0D0D0D', fontWeight: '800', fontSize: 15 },
  subtitle: { color: '#0D0D0D', fontSize: 13, opacity: 0.7, marginTop: 2 },
});
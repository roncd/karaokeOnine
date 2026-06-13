/**
 * Toast.js
 * Message d'état (succès / erreur) — design Figma
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { TOAST_MESSAGES } from './toastMessages';
import { USE_NATIVE_DRIVER } from '../utils/animation';

const YELLOW = '#F5E642';
const NAVY = '#1A3651';

function resolveToastContent({ type, title, subtitle, message, variant }) {
  if (title) {
    return {
      variant: variant || (type === 'error' || type === 'full' || type === 'notFound' ? 'error' : 'success'),
      title,
      subtitle: subtitle ?? message ?? '',
    };
  }

  const legacyMap = {
    success: TOAST_MESSAGES.voteRecorded,
    full: TOAST_MESSAGES.roomFull,
    error: TOAST_MESSAGES.songNotFound,
    notFound: TOAST_MESSAGES.songNotFound,
    songAdded: TOAST_MESSAGES.songAdded,
    songDeleted: TOAST_MESSAGES.songDeleted,
    songSkipped: TOAST_MESSAGES.songSkipped,
    skipVote: TOAST_MESSAGES.skipVote,
    voteRecorded: TOAST_MESSAGES.voteRecorded,
  };

  const preset = legacyMap[type] || TOAST_MESSAGES.voteRecorded;
  return {
    variant: preset.variant,
    title: preset.title,
    subtitle: subtitle ?? message ?? preset.subtitle,
  };
}

export default function Toast(props) {
  const { type, title, subtitle, message, variant } = props;
  const content = resolveToastContent({ type, title, subtitle, message, variant });
  const opacity = useRef(new Animated.Value(0)).current;
  const visible = Boolean(title || type || message || subtitle);

  useEffect(() => {
    if (!visible) return undefined;

    opacity.setValue(0);
    const animation = Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: USE_NATIVE_DRIVER }),
      Animated.delay(2500),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: USE_NATIVE_DRIVER }),
    ]);

    animation.start();
    return () => animation.stop();
  }, [visible, title, subtitle, message, type, variant, opacity]);

  if (!visible) return null;

  const isSuccess = content.variant === 'success';

  return (
    <Animated.View style={[styles.toast, { opacity }]}>
      <View style={[styles.iconCircle, isSuccess ? styles.iconSuccess : styles.iconError]}>
        <Text style={styles.iconText}>{isSuccess ? '✓' : '✕'}</Text>
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{content.title}</Text>
        {content.subtitle ? (
          <Text style={styles.subtitle}>{content.subtitle}</Text>
        ) : null}
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
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    zIndex: 999,
    elevation: 8,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  iconSuccess: {
    backgroundColor: NAVY,
  },
  iconError: {
    backgroundColor: NAVY,
  },
  iconText: {
    color: YELLOW,
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 16,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    color: NAVY,
    fontWeight: '800',
    fontSize: 16,
  },
  subtitle: {
    color: NAVY,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
    opacity: 0.9,
  },
});

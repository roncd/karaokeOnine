import React, { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';

export function FloatingSparkle({ style, size = 18, duration = 2200, delay = 0 }) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: duration / 2,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [delay, duration, pulse]);

  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.35, 1],
  });

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1.15],
  });

  return (
    <Animated.Text
      style={[style, { fontSize: size, opacity, transform: [{ scale }] }]}
    >
      +
    </Animated.Text>
  );
}

export function FloatingNote({ style, children, duration = 4500, delay = 0, floatY = 8 }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: duration / 2,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [delay, duration, progress]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-floatY, floatY],
  });

  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['-4deg', '4deg'],
  });

  return (
    <Animated.Text
      style={[style, { transform: [{ translateY }, { rotate }] }]}
    >
      {children}
    </Animated.Text>
  );
}

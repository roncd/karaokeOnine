import React, { useEffect, useRef } from 'react';
import { Animated, Image } from 'react-native';

export default function GlowStar({
  size = 120,
  style,
  opacity = 1,
  floatY = 12,
  rotateDeg = 5,
  duration = 6000,
  delay = 0,
}) {
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
    outputRange: [`-${rotateDeg}deg`, `${rotateDeg}deg`],
  });

  const animatedOpacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [opacity * 0.82, opacity, opacity * 0.88],
  });

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size * 1.08,
          opacity: animatedOpacity,
          transform: [{ translateY }, { rotate }],
        },
        style,
      ]}
      pointerEvents="none"
    >
      <Image
        source={require('../../assets/decorations/glow-star.png')}
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'contain',
        }}
      />
    </Animated.View>
  );
}

import React from 'react';
import { Image, View } from 'react-native';

export default function GlowStar({ size = 120, style, opacity = 1 }) {
  return (
    <View
      style={[
        {
          width: size,
          height: size * 1.08,
          opacity,
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
    </View>
  );
}

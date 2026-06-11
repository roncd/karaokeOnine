import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Platform,
  useWindowDimensions,
} from 'react-native';
import styles from './viewStyles/HomeView.styles';
import GlowStar from '../components/GlowStar';

// const NAVY = '#0B3D5E';
// const YELLOW = '#F5E642';

function Sparkle({ style, size = 18 }) {
  return (
    <Text style={[styles.sparkle, style, { fontSize: size }]}>+</Text>
  );
}

export default function HomeView({ onCreateLobby, onJoinLobby }) {
  const { width } = useWindowDimensions();
  const isCompact = width < 640;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Image
          source={require('../../assets/logo/logo_karaoke.png')}
          style={styles.logo}
        />
      </View>

      <View style={styles.container}>
        <GlowStar size={240} style={styles.starTopLeft} opacity={0.9} />
        <GlowStar size={170} style={styles.starLeftMid} opacity={0.75} />
        <GlowStar size={150} style={styles.starRightMid} opacity={0.8} />
        <GlowStar size={210} style={styles.starBottomLeft} opacity={0.85} />
        <GlowStar size={190} style={styles.starBottomCenter} opacity={0.65} />

        <Sparkle style={styles.sparkle1} />
        <Sparkle style={styles.sparkle2} size={16} />
        <Sparkle style={styles.sparkle3} size={14} />
        <Sparkle style={styles.sparkle4} size={20} />

        <Text style={styles.noteSingle}>♪</Text>
        <Text style={styles.noteBeamed}>♫</Text>

        <View style={styles.hero}>
          <Text style={[styles.title, isCompact && styles.titleCompact]}>
            KARAOKE O'NINE
          </Text>
          <Text style={styles.subtitle}>Ici, tout le monde est une star</Text>

          <View
            style={[
              styles.buttonGroup,
              isCompact && styles.buttonGroupCompact,
            ]}
          >
            <TouchableOpacity
              style={[styles.button, isCompact && styles.buttonCompact]}
              onPress={onCreateLobby}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>Créer un salon</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, isCompact && styles.buttonCompact]}
              onPress={onJoinLobby}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>Rejoindre un salon</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
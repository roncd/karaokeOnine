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
import GlowStar from '../components/GlowStar';

const NAVY = '#1A3651';
const YELLOW = '#FEF058';

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

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: NAVY,
  },
  header: {
    paddingHorizontal: 28,
    paddingTop: Platform.OS === 'web' ? 24 : 8,
    paddingBottom: 8,
  },
  logo: {
    width: 72,
    height: 72,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 48,
    overflow: 'hidden',
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 760,
    zIndex: 2,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 1,
    color: YELLOW,
    textAlign: 'center',
    ...Platform.select({
      web: {
        fontFamily: '"Fredoka", "Nunito", "Varela Round", sans-serif',
        lineHeight: 58,
      },
      default: {},
    }),
  },
  titleCompact: {
    fontSize: 34,
    letterSpacing: 0.5,
    lineHeight: 42,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.88,
    textAlign: 'center',
    ...Platform.select({
      web: { fontFamily: '"Inter", "Helvetica Neue", sans-serif' },
      default: {},
    }),
  },
  buttonGroup: {
    marginTop: 36,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
  },
  buttonGroupCompact: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 14,
  },
  button: {
    flex: 1,
    minWidth: 180,
    maxWidth: 280,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderRadius: 999,
    backgroundColor: YELLOW,
  },
  buttonCompact: {
    maxWidth: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    color: NAVY,
    textAlign: 'center',
    ...Platform.select({
      web: { fontFamily: '"Inter", "Helvetica Neue", sans-serif' },
      default: {},
    }),
  },
  starTopLeft: {
    position: 'absolute',
    top: '6%',
    left: '-4%',
    zIndex: 0,
  },
  starLeftMid: {
    position: 'absolute',
    top: '52%',
    left: '-6%',
    zIndex: 0,
  },
  starRightMid: {
    position: 'absolute',
    top: '28%',
    right: '-5%',
    zIndex: 0,
  },
  starBottomLeft: {
    position: 'absolute',
    bottom: '6%',
    left: '4%',
    zIndex: 0,
  },
  starBottomCenter: {
    position: 'absolute',
    bottom: '-8%',
    left: '42%',
    zIndex: 0,
  },
  sparkle: {
    position: 'absolute',
    color: YELLOW,
    opacity: 0.75,
    fontWeight: '300',
    zIndex: 1,
  },
  sparkle1: { top: '12%', left: '22%' },
  sparkle2: { top: '28%', right: '18%' },
  sparkle3: { bottom: '34%', left: '28%' },
  sparkle4: { top: '52%', left: '12%' },
  noteSingle: {
    position: 'absolute',
    bottom: '18%',
    right: '12%',
    fontSize: 42,
    color: YELLOW,
    zIndex: 1,
  },
  noteBeamed: {
    position: 'absolute',
    bottom: '12%',
    right: '6%',
    fontSize: 56,
    color: YELLOW,
    zIndex: 1,
  },
});

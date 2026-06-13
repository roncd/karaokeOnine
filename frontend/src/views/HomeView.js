import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  useWindowDimensions,
} from 'react-native';
import styles from './viewStyles/HomeView.styles';
import GlowStar from '../components/GlowStar';
import { FloatingNote, FloatingSparkle } from '../components/FloatingDecor';

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
        <GlowStar
          size={240}
          style={styles.starTopLeft}
          opacity={0.9}
          floatY={14}
          rotateDeg={4}
          duration={7800}
        />
        <GlowStar
          size={170}
          style={styles.starLeftMid}
          opacity={0.75}
          floatY={10}
          rotateDeg={7}
          duration={9200}
          delay={400}
        />
        <GlowStar
          size={150}
          style={styles.starRightMid}
          opacity={0.8}
          floatY={12}
          rotateDeg={6}
          duration={6800}
          delay={800}
        />
        <GlowStar
          size={210}
          style={styles.starBottomLeft}
          opacity={0.85}
          floatY={16}
          rotateDeg={5}
          duration={8400}
          delay={200}
        />
        <GlowStar
          size={190}
          style={styles.starBottomCenter}
          opacity={0.65}
          floatY={11}
          rotateDeg={8}
          duration={9600}
          delay={600}
        />

        <FloatingSparkle style={[styles.sparkle, styles.sparkle1]} duration={2400} />
        <FloatingSparkle
          style={[styles.sparkle, styles.sparkle2]}
          size={16}
          duration={2800}
          delay={300}
        />
        <FloatingSparkle
          style={[styles.sparkle, styles.sparkle3]}
          size={14}
          duration={2100}
          delay={600}
        />
        <FloatingSparkle
          style={[styles.sparkle, styles.sparkle4]}
          size={20}
          duration={2600}
          delay={150}
        />

        <FloatingNote style={styles.noteSingle} duration={5200}>
          ♪
        </FloatingNote>
        <FloatingNote style={styles.noteBeamed} duration={4800} delay={350} floatY={10}>
          ♫
        </FloatingNote>

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
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import styles from './PopularSongsSection.styles';

export default function PopularSongsSection({
  topSongs = [],
  loading = false,
  compact = false,
}) {
  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <Text style={styles.title}>Chansons les plus populaires</Text>

      {loading ? (
        <ActivityIndicator color="#F5E642" style={styles.loader} />
      ) : topSongs.length === 0 ? (
        <Text style={styles.empty}>
          Aucune chanson jouée pour l'instant — lancez un salon !
        </Text>
      ) : (
        topSongs.map((song, index) => (
          <View key={`${song.titre}-${song.artiste}`} style={styles.row}>
            <View style={styles.rank}>
              <Text style={styles.rankText}>{index + 1}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.songTitle} numberOfLines={1}>
                {song.titre}
              </Text>
              <Text style={styles.songArtist} numberOfLines={1}>
                {song.artiste}
              </Text>
            </View>
            <Text style={styles.count}>{song.playCount}×</Text>
          </View>
        ))
      )}
    </View>
  );
}

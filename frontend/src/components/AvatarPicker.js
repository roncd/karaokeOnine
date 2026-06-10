import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

const AVATARS = [
  require('../../assets/avatars/avatar1.png'),
  require('../../assets/avatars/avatar2.png'),
  require('../../assets/avatars/avatar3.png'),
  require('../../assets/avatars/avatar4.png'),
  require('../../assets/avatars/avatar5.png'),
  require('../../assets/avatars/avatar6.png'),
  require('../../assets/avatars/avatar7.png'),
  require('../../assets/avatars/avatar8.png'),
];

export default function AvatarPicker({ selected, onSelect }) {
  return (
    <View style={styles.row}>
      {AVATARS.map((src, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onSelect(index)}
          style={[
            styles.avatarCircle,
            selected === index && styles.avatarSelected
          ]}
        >
          <Image source={src} style={styles.avatarImg} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginTop: 12,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarSelected: {
    borderColor: '#F5E642',
  },
  avatarImg: {
    width: 60,
    height: 60,
  },
});

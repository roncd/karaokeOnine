import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  TextInput
} from 'react-native';
import styles from './viewStyles/CreateLobbyView.styles';
import AvatarPicker from '../components/AvatarPicker';

export default function CreateLobbyView({ lobbyId, onBack, onShare, onStart, pseudo, onChangePseudo, avatarIndex, onSelectAvatar }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>

        {/* Logo */}
        <Image
          source={require('../../assets/logo/logo_karaoke.png')}
          style={styles.logo}
        />

        {/* Titre */}
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Créer un salon</Text>
          <Text style={styles.subtitle}>Générez un code unique à 6 chiffres</Text>
        </View>

        {/* Code */}
        <View style={styles.idBlock}>
          {lobbyId ? (
            <View style={styles.codeRow}>
              <Text style={styles.codeText}>{lobbyId}</Text>
              <TouchableOpacity onPress={onShare} style={styles.copyBtn}>
                <Text style={styles.copyIcon}>⧉</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <ActivityIndicator color="#F5E642" size="large" />
          )}
        </View>

        {/* Pseudo */}
        <View style={styles.titleBlock}>
          <Text style={{ color: '#fff', opacity: 0.7 }}>Votre pseudo</Text>
        </View>

        <View style={styles.idBlock}>
          <TextInput
            style={styles.pseudoInput}
            value={pseudo}
            onChangeText={onChangePseudo}
            placeholder="Entrez votre pseudo"
            placeholderTextColor="rgba(255,255,255,0.3)"
          />
        </View>

        {/* Avatar */}
        <View style={styles.titleBlock}>
          <Text style={{ color: '#fff', opacity: 0.7 }}>Votre avatar</Text>
        </View>
        <AvatarPicker selected={avatarIndex} onSelect={onSelectAvatar} />

        {/* Boutons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.generateBtn}
            onPress={onShare}
            activeOpacity={0.8}
          >
            <Text style={styles.generateBtnText}>Générer</Text>
          </TouchableOpacity>

          {onStart && (
            <TouchableOpacity
              style={styles.startBtn}
              onPress={onStart}
              activeOpacity={0.8}
            >
              <Text style={styles.startBtnText}>Démarrer le salon</Text>
            </TouchableOpacity>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}

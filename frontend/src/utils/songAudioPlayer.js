import { Platform } from 'react-native';

function createWebPlayer(uri) {
  const audio = document.createElement('audio');
  audio.src = uri;
  audio.preload = 'auto';

  const play = async () => {
    try {
      await audio.play();
      return true;
    } catch {
      return false;
    }
  };

  play();

  return {
    play,
    getStatus: async () => ({
      isLoaded: true,
      positionMillis: Math.round((audio.currentTime || 0) * 1000),
      didJustFinish: audio.ended,
    }),
    stop: async () => {
      audio.pause();
      audio.currentTime = 0;
    },
    unload: async () => {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    },
  };
}

async function createNativePlayer(uri) {
  const { Audio } = await import('expo-av');
  await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
  const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true });

  return {
    play: async () => {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && !status.isPlaying) {
        await sound.playAsync();
      }
      return true;
    },
    getStatus: async () => {
      const status = await sound.getStatusAsync();
      if (!status.isLoaded) {
        return { isLoaded: false, positionMillis: 0, didJustFinish: false };
      }
      return {
        isLoaded: true,
        positionMillis: status.positionMillis,
        didJustFinish: status.didJustFinish,
      };
    },
    stop: () => sound.stopAsync(),
    unload: () => sound.unloadAsync(),
  };
}

export async function createSongPlayer(uri) {
  if (Platform.OS === 'web') {
    return createWebPlayer(uri);
  }
  return createNativePlayer(uri);
}

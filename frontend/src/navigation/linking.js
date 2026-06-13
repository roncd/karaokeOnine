import { Platform } from 'react-native';

const webPrefix =
  Platform.OS === 'web' && typeof window !== 'undefined'
    ? window.location.origin
    : 'http://localhost:8080';

export const linking = {
  prefixes: [webPrefix],
  config: {
    screens: {
      Home: '',
      CreateLobby: 'create-lobby',
      JoinLobby: 'join-lobby',
      Lobby: 'lobby/:lobbyId',
      Ready: 'ready',
      Lyrics: 'lyrics',
      VoteStar: 'vote-star',
    },
  },
};

export function isWebRootPath() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return false;
  }

  const path = window.location.pathname.replace(/\/$/, '') || '/';
  return path === '' || path === '/' || path === '/index.html';
}

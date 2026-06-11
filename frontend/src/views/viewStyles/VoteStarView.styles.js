import { StyleSheet, Platform } from 'react-native';

const YELLOW = '#F5E642';
const BG = '#0B3D5E';

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },

  // Logo
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  // Contenu principal
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 40,
  },
  title: {
    color: YELLOW,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
    ...Platform.select({
      web: {
        fontFamily: '"Fredoka", "Nunito", "Varela Round", sans-serif',
      },
      default: {},
    }),
  },

  // Grille
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    maxWidth: 400,
  },

  // Avatar
  avatarWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapperSelected: {},
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarCircleSelected: {
    borderColor: YELLOW,
    borderWidth: 2.5,
  },
  hostIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  // Bouton confirmer
  confirmBtn: {
    backgroundColor: YELLOW,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 14,
  },
  confirmBtnDisabled: {
    opacity: 0.35,
  },
  confirmBtnText: {
    color: '#0D0D0D',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1,
  },

  // Message attente
  waitingText: {
    color: '#fff',
    opacity: 0.6,
    fontSize: 14,
    textAlign: 'center',
  },

  // Écran gagnant
  winnerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    paddingHorizontal: 32,
  },
  winnerTitle: {
    color: YELLOW,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
  winnerAvatarWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerAvatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 3,
    borderColor: YELLOW,
  },
  winnerStar: {
    position: 'absolute',
    top: -12,
    right: -12,
    fontSize: 32,
    color: YELLOW,
  },
  winnerSubtitle: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.7,
  },
  continueBtn: {
    backgroundColor: YELLOW,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 14,
  },
  continueBtnText: {
    color: '#0D0D0D',
    fontWeight: '800',
    fontSize: 16,
    letterSpacing: 1,
  },
});
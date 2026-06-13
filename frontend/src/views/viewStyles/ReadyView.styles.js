import { StyleSheet, Platform } from 'react-native';

const YELLOW = '#F5E642';
const BG     = '#0B3D5E';

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  logo: {
  width: 60,
  height: 60,
  resizeMode: 'contain',
},
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 32,
  },

  // Avatar
  avatarBlock: {
    alignItems: 'center',
    gap: 20,
  },
  avatarCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },

  // Bouton prêt
  readyBtn: {
    backgroundColor: YELLOW,
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 14,
  },
  readyBtnText: {
    color: '#0D0D0D',
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 1,
  },

  // Badge attente
  waitingBadge: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  waitingText: {
    color: '#fff',
    fontSize: 15,
    opacity: 0.7,
  },
  skippedText: {
    color: YELLOW,
    fontSize: 16,
    fontWeight: '700',
  },
  singerName: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },

  // Chanson
  songTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    opacity: 0.8,
    textAlign: 'center',
  },

  // Barre de progression
  progressTrack: {
    flexDirection: 'row',
    width: '100%',
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  progressBar: {
    backgroundColor: YELLOW,
    borderRadius: 5,
  },

  // Countdown
  countdown: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    letterSpacing: 1,
  },
});

import { StyleSheet, Platform } from 'react-native';

const YELLOW = '#F5E642';
const BG = '#0B3D5E';
const CARD = '#0D4D72';

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 15,
  },

  // Logo
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },

  // Titre
  titleBlock: {
    gap: 8,
    marginTop: 16,
  },
  title: {
    color: YELLOW,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.7,
  },

  // Code
  idBlock: {
    justifyContent: 'center',
    gap: 12,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: YELLOW,
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 10,
    paddingHorizontal: 24,
    gap: 16,
    backgroundColor: CARD,
    width: '100%',
    justifyContent: 'space-between',
  },
  codeText: {
    color: YELLOW,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 10,
  },
  copyBtn: {
    padding: 4,
  },
  copyIcon: {
    color: YELLOW,
    fontSize: 22,
  },

  // Pseudo avatar
  pseudoInput: {
    borderWidth: 1,
    borderColor: 'rgba(245,230,66,0.4)',
    borderRadius: 8,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 12,
  },

  // Boutons
  actions: {
    gap: 12,
  },
  generateBtn: {
    backgroundColor: YELLOW,
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  generateBtnText: {
    color: '#0D0D0D',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 1,
  },
  startBtn: {
    borderWidth: 1.5,
    borderColor: YELLOW,
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  startBtnText: {
    color: YELLOW,
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 1,
  },
});
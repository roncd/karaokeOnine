import { StyleSheet, Platform } from 'react-native';

const YELLOW = '#F5E642';
const BG = '#0B3D5E';
const CARD = '#0D4D72';

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  flex: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
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
    ...Platform.select({
      web: {
        fontFamily: '"Fredoka", "Nunito", "Varela Round", sans-serif',
      },
      default: {},
    }),

  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.7,
  },

  // Input
  inputBlock: {
    justifyContent: 'center',
    gap: 12,
  },
  input: {
    borderWidth: 1.5,
    borderColor: YELLOW,
    borderRadius: 14,
    color: YELLOW,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 16,
    textAlign: 'center',
    paddingVertical: 10,
    marginVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: CARD,
  },
  inputError: {
    borderColor: '#FF4D4D',
  },
  errorText: {
    color: '#FF4D4D',
    fontSize: 13,
    textAlign: 'center',
  },

  // pseudo avatar
  pseudoInput: {
    borderWidth: 1,
    borderColor: 'rgba(245,230,66,0.4)',
    borderRadius: 14,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 12,
  },
  // Bouton
  joinBtn: {
    backgroundColor: YELLOW,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  joinBtnDisabled: {
    opacity: 0.35,
  },
  joinBtnText: {
    color: '#0D0D0D',
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 1,
    marginTop: 10
  },
});
import { StyleSheet, Platform } from 'react-native';

const NAVY = '#0B3D5E';
const YELLOW = '#F5E642';


export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: NAVY,
  },
  header: {
    paddingHorizontal: 28,
    paddingTop: Platform.OS === 'web' ? 24 : 8,
    paddingBottom: 8,
  },
  logo: {
    width: 72,
    height: 72,
    resizeMode: 'contain',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 48,
    overflow: 'hidden',
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 760,
    zIndex: 2,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 1,
    color: YELLOW,
    textAlign: 'center',
    ...Platform.select({
      web: {
        fontFamily: '"Fredoka", "Nunito", "Varela Round", sans-serif',
        lineHeight: 58,
      },
      default: {},
    }),
  },
  titleCompact: {
    fontSize: 34,
    letterSpacing: 0.5,
    lineHeight: 42,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.88,
    textAlign: 'center',
    ...Platform.select({
      web: { fontFamily: '"Inter", "Helvetica Neue", sans-serif' },
      default: {},
    }),
  },
  buttonGroup: {
    marginTop: 36,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
  },
  buttonGroupCompact: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 14,
  },
  button: {
    flex: 1,
    minWidth: 180,
    maxWidth: 280,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 22,
    borderRadius: 999,
    backgroundColor: YELLOW,
  },
  buttonCompact: {
    maxWidth: '100%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    color: NAVY,
    textAlign: 'center',
    ...Platform.select({
      web: { fontFamily: '"Inter", "Helvetica Neue", sans-serif' },
      default: {},
    }),
  },
  starTopLeft: {
    position: 'absolute',
    top: '6%',
    left: '-4%',
    zIndex: 0,
  },
  starLeftMid: {
    position: 'absolute',
    top: '52%',
    left: '-6%',
    zIndex: 0,
  },
  starRightMid: {
    position: 'absolute',
    top: '28%',
    right: '-5%',
    zIndex: 0,
  },
  starBottomLeft: {
    position: 'absolute',
    bottom: '6%',
    left: '4%',
    zIndex: 0,
  },
  starBottomCenter: {
    position: 'absolute',
    bottom: '-8%',
    left: '42%',
    zIndex: 0,
  },
  sparkle: {
    position: 'absolute',
    color: YELLOW,
    opacity: 0.75,
    fontWeight: '300',
    zIndex: 1,
  },
  sparkle1: { top: '12%', left: '22%' },
  sparkle2: { top: '28%', right: '18%' },
  sparkle3: { bottom: '34%', left: '28%' },
  sparkle4: { top: '52%', left: '12%' },
  noteSingle: {
    position: 'absolute',
    bottom: '18%',
    right: '12%',
    fontSize: 42,
    color: YELLOW,
    zIndex: 1,
  },
  noteBeamed: {
    position: 'absolute',
    bottom: '12%',
    right: '6%',
    fontSize: 56,
    color: YELLOW,
    zIndex: 1,
  },
});

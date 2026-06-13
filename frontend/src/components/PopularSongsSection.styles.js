import { StyleSheet, Platform } from 'react-native';

const NAVY = '#0B3D5E';
const YELLOW = '#F5E642';

export default StyleSheet.create({
  card: {
    marginTop: 20,
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245, 230, 66, 0.35)',
  },
  cardCompact: {
    marginTop: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: YELLOW,
    textAlign: 'center',
    marginBottom: 12,
    ...Platform.select({
      web: { fontFamily: '"Fredoka", "Nunito", sans-serif' },
      default: {},
    }),
  },
  loader: {
    marginVertical: 10,
  },
  empty: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.65)',
    textAlign: 'center',
    lineHeight: 20,
    ...Platform.select({
      web: { fontFamily: '"Inter", sans-serif' },
      default: {},
    }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  rank: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: YELLOW,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rankText: {
    fontSize: 12,
    fontWeight: '800',
    color: NAVY,
  },
  info: {
    flex: 1,
    marginRight: 8,
  },
  songTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
    ...Platform.select({
      web: { fontFamily: '"Inter", sans-serif' },
      default: {},
    }),
  },
  songArtist: {
    marginTop: 2,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.65)',
    ...Platform.select({
      web: { fontFamily: '"Inter", sans-serif' },
      default: {},
    }),
  },
  count: {
    fontSize: 13,
    fontWeight: '800',
    color: YELLOW,
    minWidth: 32,
    textAlign: 'right',
  },
});

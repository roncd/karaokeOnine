import { StyleSheet, Platform } from 'react-native';

const NAVY = '#0B3D5E';
const YELLOW = '#F5E642';

export default StyleSheet.create({
  card: {
    marginTop: 20,
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(245, 230, 66, 0.35)',
  },
  cardCompact: {
    marginTop: 0,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: YELLOW,
    textAlign: 'center',
    marginBottom: 14,
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
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  rank: {
    width: 28,
    height: 28,
    borderRadius: 14,
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

// import { StyleSheet } from 'react-native';

// const YELLOW = '#F5E642';
// const BG = '#0B3D5E';
// const CARD = '#0D4D72';

// export default StyleSheet.create({
//   safe: {
//     flex: 1,
//     backgroundColor: BG,
//   },

//   // Header
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingVertical: 14,
//   },
//   logo: {
//     width: 60,
//     height: 60,
//     resizeMode: 'contain',
//   },
//   dotsBtn: { padding: 8 },
//   dotsBtnText: { color: '#fff', fontSize: 20, letterSpacing: 2 },
//   addBtn: {
//     backgroundColor: YELLOW,
//     width: 44,
//     height: 44,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   addBtnText: { color: '#0D0D0D', fontSize: 24, fontWeight: '900' },

//   // Contenu principal
//   content: { flex: 1 },
//   contentDesktop: { flexDirection: 'row' },

//   // ── Colonne paroles ──────────────────────────────────────────────────────────
//   lyricsPanelMobile: { flex: 1 },
//   lyricsPanelDesktop: { flex: 1 },
//   lyricsPanelContent: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 48,
//     paddingVertical: 40,
//   },
//   lyricsPanel: {
//     alignItems: 'center',
//     gap: 24,
//   },
//   lyricLine: {
//     color: 'rgba(255,255,255,0.0)',   // lignes non-actives invisibles
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   lyricLineCurrent: {
//     color: YELLOW,
//     fontSize: 28,
//     fontWeight: '700',
//     lineHeight: 38,
//   },
//   lyricLinePast: {
//     color: 'rgba(245,230,66,0.45)',
//     fontSize: 22,
//     fontWeight: '600',
//   },
//   loadingText: { color: '#fff', opacity: 0.5, fontSize: 14 },

//   // ── Colonne droite (desktop) ─────────────────────────────────────────────────
//   // Toute la colonne droite : queue + footer droit
//   rightColumn: {
//     width: 240,
//     paddingTop: 8,
//     paddingRight: 20,
//     paddingBottom: 20,
//     flexDirection: 'column',
//     justifyContent: 'space-between',
//   },

//   // File d'attente
//   queuePanel: { gap: 12 },
//   queueItem: {
//     backgroundColor: CARD,
//     borderRadius: 10,
//     paddingVertical: 18,
//     paddingHorizontal: 16,
//   },
//   queueItemActive: {
//     borderWidth: 1.5,
//     borderColor: YELLOW,
//   },
//   queueItemText: {
//     color: '#fff',
//     fontSize: 13,
//     opacity: 0.7,
//   },
//   queueItemTextActive: {
//     color: YELLOW,
//     opacity: 1,
//     fontWeight: '700',
//   },

//   // Bas de la colonne droite : participants
//   rightFooter: {
//     gap: 8,
//     paddingTop: 16,
//   },
//   participantCount: {
//     color: '#fff',
//     fontSize: 14,
//     opacity: 0.8,
//     marginBottom: 4,
//   },
//   avatarsRow: {
//     flexDirection: 'row',
//     gap: 10,
//   },
//   avatarCircle: {
//     width: 52,
//     height: 52,
//     borderRadius: 26,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//   },
//   avatarCircleActive: {
//     borderWidth: 2.5,
//     borderColor: YELLOW,
//   },

//   // ── Footer gauche (réactions) ────────────────────────────────────────────────
//   footer: {
//     paddingHorizontal: 20,
//     paddingBottom: 24,
//     paddingTop: 8,
//   },
//   reactionsRow: {
//     flexDirection: 'row',
//     gap: 20,
//   },
//   reactionBtn: { padding: 4 },
//   reactionBtnText: { fontSize: 26 },

//   // Bulles de réactions animées
//   reactionsOverlay: {
//     position: 'absolute',
//     bottom: 80,
//     left: 20,
//     gap: 8,
//   },
//   reactionBubble: {
//     fontSize: 28,
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//   },

//   // ── Modal mobile ──────────────────────────────────────────────────────────────
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'flex-end',
//   },
//   modalBox: {
//     backgroundColor: BG,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     maxHeight: '80%',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   modalBack: { color: YELLOW, fontSize: 20, fontWeight: '700' },
//   modalCurrentSong: {
//     color: YELLOW,
//     fontSize: 15,
//     fontWeight: '700',
//     flex: 1,
//     textAlign: 'center',
//     marginHorizontal: 8,
//   },
//   modalAddBtn: {
//     backgroundColor: YELLOW,
//     width: 32,
//     height: 32,
//     borderRadius: 6,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   modalAddBtnText: { color: '#0D0D0D', fontSize: 18, fontWeight: '900' },
//   modalReactions: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     gap: 24,
//     marginTop: 16,
//     paddingTop: 16,
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(255,255,255,0.1)',
//   },

//   // Participants mobile footer (sous réactions)
//   participantsRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginTop: 12,
//   },
// });
import { StyleSheet } from 'react-native';

const YELLOW  = '#F5E642';
const BG      = '#0B3D5E';
const CARD    = '#0D4D72';
const DARK    = '#043049'; // colonne droite plus foncée

export default StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  // ── Header ────────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  logo: { width: 60, height: 60 },
  dotsBtn: { padding: 8 },
  dotsBtnText: { color: '#fff', fontSize: 20, letterSpacing: 2 },
  addBtn: {
    backgroundColor: YELLOW,
    width: 44, height: 44,
    borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { color: '#0D0D0D', fontSize: 24, fontWeight: '900' },

  // ── Layout ────────────────────────────────────────────────────────────────
  content: { flex: 1 },
  contentDesktop: { flexDirection: 'row' },

  // Desktop : wrapper pleine hauteur
  desktopLayout: { flex: 1, flexDirection: 'row' },
  leftSide:  { flex: 1, flexDirection: 'column' },
  headerLeft: { paddingHorizontal: 20, paddingVertical: 14 },
  rightSide: {
    width: 260,
    backgroundColor: '#043049',
    flexDirection: 'column',
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  headerRight: {
    paddingTop: 14,
    paddingBottom: 10,
    alignItems: 'flex-end',
  },

  // ── Paroles ───────────────────────────────────────────────────────────────
  lyricsPanelMobile:  { flex: 1 },
  lyricsPanelDesktop: { flex: 1 },
  lyricsPanelContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
    paddingVertical: 40,
  },
  lyricsPanel: { alignItems: 'center', gap: 24 },
  lyricLine: {
    color: 'transparent',
    fontSize: 18,
    textAlign: 'center',
  },
  lyricLinePast: {
    color: 'rgba(245,230,66,0.45)',
    fontSize: 22,
    fontWeight: '600',
  },
  lyricLineCurrent: {
    color: YELLOW,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 38,
  },
  lyricLineNext: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 18,
  },
  loadingText: { color: '#fff', opacity: 0.5, fontSize: 14 },

  queueScroll: { flex: 1 },
  queuePanel: { gap: 10 },

  queueItem: {
    backgroundColor: CARD,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 14,
  },
  queueItemActive: {
    borderWidth: 1.5,
    borderColor: YELLOW,
  },
  queueItemText: { color: '#fff', fontSize: 13, opacity: 0.7 },
  queueItemTextActive: { color: YELLOW, opacity: 1, fontWeight: '700' },
  queueItemSinger: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 2 },

  // Hint inline dans l'item sélectionné
  skipInlineHint: { marginTop: 6 },
  skipInlineHintText: { color: YELLOW, fontSize: 11, opacity: 0.8 },

  // Barre de vote skip
  skipBarContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    marginBottom: 4,
  },
  skipBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  skipBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  skipBarFill: { height: 6, backgroundColor: YELLOW, borderRadius: 3 },
  skipCount: { color: '#fff', fontSize: 11, opacity: 0.7, minWidth: 28 },
  skipBtn: {
    backgroundColor: YELLOW,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  skipBtnText: { color: '#0D0D0D', fontSize: 12, fontWeight: '700' },

  // ── Bas colonne droite : participants ─────────────────────────────────────
  rightFooter: {
    paddingTop: 16,
    gap: 8,
  },
  participantCount: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  avatarsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  avatarCircleSinging: {
    borderColor: YELLOW,
    borderWidth: 2.5,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarStarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarStarText: { fontSize: 10 },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 8,
  },
  reactionsRow: { flexDirection: 'row', gap: 20 },
  reactionBtn: { padding: 4 },
  reactionBtnText: { fontSize: 26 },

  // Bulles réactions
  reactionBubble: {
    fontSize: 28,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },

  // ── Modal mobile ──────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: BG,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalBack: { color: YELLOW, fontSize: 20, fontWeight: '700' },
  modalCurrentSong: {
    color: YELLOW, fontSize: 15, fontWeight: '700',
    flex: 1, textAlign: 'center', marginHorizontal: 8,
  },
  modalAddBtn: {
    backgroundColor: YELLOW,
    width: 32, height: 32,
    borderRadius: 6,
    alignItems: 'center', justifyContent: 'center',
  },
  modalAddBtnText: { color: '#0D0D0D', fontSize: 18, fontWeight: '900' },
  modalReactions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
});
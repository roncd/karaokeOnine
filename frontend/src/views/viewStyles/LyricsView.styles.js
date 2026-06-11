import { StyleSheet, Platform } from 'react-native';

const YELLOW = '#F5E642';
const BG = '#0B3D5E';
const CARD = '#0D4D72';

export default StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  dotsBtn: { padding: 8 },
  dotsBtnText: { color: '#fff', fontSize: 20, letterSpacing: 2 },
  addBtn: {
    backgroundColor: YELLOW,
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#0D0D0D', fontSize: 20, fontWeight: '900' },

  // Contenu
  content: { flex: 1 },
  contentDesktop: { flexDirection: 'row' },

  // Paroles
  lyricsPanelMobile: { flex: 1 },
  lyricsPanelDesktop: { flex: 1 },
  lyricsPanelContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
    gap: 20,
  },
  lyricsPanel: { alignItems: 'center', gap: 20 },
  lyricLine: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 16,
    textAlign: 'center',
  },
  lyricLineCurrent: {
    color: YELLOW,
    fontSize: 20,
    fontWeight: '700',
  },
  lyricLinePast: {
    color: 'rgba(245,230,66,0.4)',
    fontSize: 15,
  },
  loadingText: { color: '#fff', opacity: 0.5, fontSize: 14 },

  // File d'attente desktop
  queuePanelDesktop: {
    width: 220,
    paddingTop: 16,
    paddingRight: 16,
    gap: 8,
  },
  queuePanel: { gap: 8 },
  queueItem: {
    backgroundColor: CARD,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  queueItemActive: {
    borderWidth: 1.5,
    borderColor: YELLOW,
  },
  queueItemText: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.7,
  },
  queueItemTextActive: {
    color: YELLOW,
    opacity: 1,
    fontWeight: '700',
  },
  addQueueBtn: {
    backgroundColor: YELLOW,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  addQueueBtnText: { color: '#0D0D0D', fontSize: 18, fontWeight: '900' },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 8,
  },
  reactionsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  reactionBtn: { padding: 4 },
  reactionBtnText: { fontSize: 24 },
  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  participantCount: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.7,
    marginRight: 4,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  // Réactions animées
  reactionsOverlay: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    gap: 8,
  },
  reactionBubble: {
    fontSize: 28,
    position: 'absolute',
    bottom: 0,
    left: 0,
  },

  // Modal mobile
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
    color: YELLOW,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  modalAddBtn: {
    backgroundColor: YELLOW,
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
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
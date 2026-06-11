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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },

  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },

  hostBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: YELLOW,
    marginLeft: 4,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lobbyCode: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotOnline: { backgroundColor: '#4ADE80' },
  dotOffline: { backgroundColor: '#EF4444' },
  leaveText: {
    color: '#888',
    fontSize: 13,
  },

  // Contenu
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  // Toast
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 8,
    padding: 14,
    borderRadius: 12,
    gap: 10,
  },
  toastSuccess: { backgroundColor: YELLOW },
  toastError: { backgroundColor: YELLOW },
  toastIcon: { fontSize: 16, color: '#0D0D0D', fontWeight: '900' },
  toastText: { color: '#0D0D0D', fontWeight: '700', fontSize: 14 },

  // Host — file d'attente
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statsText: {
    color: '#fff',
    fontSize: 13,
    opacity: 0.6,
  },
  addBtn: {
    backgroundColor: YELLOW,
    width: 36,
    height: 36,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#0D0D0D',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 22,
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  queueHeaderText: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.4,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: CARD,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  queueItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  queueIndex: {
    color: YELLOW,
    fontWeight: '800',
    fontSize: 14,
    width: 20,
  },
  queueTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  queueDots: { paddingLeft: 8 },
  queueDotsText: { color: '#888', fontSize: 18, letterSpacing: 2 },
  queueCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  emptyQueue: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyText: { color: '#fff', fontSize: 16, fontWeight: '700', opacity: 0.5 },
  emptyHint: { color: '#fff', fontSize: 13, opacity: 0.3 },

  // Skip
  skipBtn: {
    borderWidth: 1.5,
    borderColor: YELLOW,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  skipBtnText: {
    color: YELLOW,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
  },

  // Guest — catalogue
  catalogueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  catalogueTitle: {
    color: YELLOW,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
  },
  searchIcon: { fontSize: 20 },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  genreCard: {
    width: '47%',
    backgroundColor: CARD,
    borderRadius: 12,
    paddingVertical: 32,
    alignItems: 'center',
    gap: 8,
  },
  genreEmoji: { fontSize: 32 },
  genreLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },

  queueArtiste: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.5,
    flex: 1,
  },
  queueGenre: {
    color: YELLOW,
    fontSize: 11,
    opacity: 0.7,
    marginHorizontal: 4,
  },
  queueDuree: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.5,
    marginRight: 8,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalBox: {
    backgroundColor: '#0D3D5C',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    gap: 16,
  },
  modalTitle: {
    color: YELLOW,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  modalInput: {
    borderWidth: 1.5,
    borderColor: YELLOW,
    borderRadius: 8,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  modalCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  modalCancelText: { color: '#888', fontWeight: '600', fontSize: 15 },
  modalConfirm: {
    flex: 1,
    backgroundColor: YELLOW,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalConfirmText: { color: '#0D0D0D', fontWeight: '800', fontSize: 15 },

  // Ajouter ces styles dans StyleSheet.create({}) de LobbyView.js

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalClose: {
    color: '#888',
    fontSize: 18,
    padding: 4,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: 'rgba(245,230,66,0.4)',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginBottom: 12,
  },
  songList: {
    maxHeight: 320,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  songItemInfo: {
    flex: 1,
    gap: 2,
  },
  songItemTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  songItemArtiste: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.5,
  },
  songItemGenre: {
    color: '#F5E642',
    fontSize: 11,
    opacity: 0.7,
    marginLeft: 8,
  },
  emptyText: {
    color: '#fff',
    opacity: 0.4,
    textAlign: 'center',
    marginTop: 24,
    fontSize: 14,
  },

  startSongBtn: {
    backgroundColor: YELLOW,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  startSongBtnText: {
    color: '#0D0D0D',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },

  queueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CARD,
    borderRadius: 8,
    padding: 10,
    gap: 10,
  },
  queueAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  queueTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 13,
  },
  hostActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    fontSize: 16,
    color: YELLOW,
    padding: 4,
  },
  tooltip: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    backgroundColor: '#0D0D0D',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    zIndex: 10,
  },
  tooltipText: {
    color: YELLOW,
    fontSize: 11,
    fontWeight: '700',
  },
});
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
    width: '100%',
    marginBottom: 10,
  },

  statsSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  statsText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.7,
  },

  addBtn: {
    backgroundColor: YELLOW,
    width: 36,
    height: 36,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: 12,
  },
  addBtnText: {
    color: '#0D0D0D',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 22,
  },
  queueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  queueHeaderText: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.4,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'left',
  },

  queueIndex: {
    color: YELLOW,
    fontWeight: '800',
    fontSize: 14,
    width: 20,
  },
  emptyQueue: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyQueueWithStats: {
    flex: 0,
    paddingVertical: 32,
  },
  emptyText: { color: '#fff', fontSize: 16, fontWeight: '700', opacity: 0.5 },
  emptyHint: { color: '#fff', fontSize: 13, opacity: 0.3 },

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
    ...Platform.select({
      web: {
        fontFamily: '"Fredoka", "Nunito", "Varela Round", sans-serif',
      },
      default: {},
    }),
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
    textAlign: 'left',
  },
  queueGenre: {
    color: YELLOW,
    fontSize: 11,
    opacity: 0.7,
    marginHorizontal: 4,
    textAlign: 'left',
  },
  queueDuree: {
    color: '#fff',
    opacity: 0.5,
    fontSize: 12,
    textAlign: 'left',
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
  startSongBtn: {
    backgroundColor: YELLOW,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginVertical: 15,
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
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  avatarOutside: {
    marginLeft: 12,
    marginRight: 4,
  },
  queueAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  queueItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingRight: 50,
  },
  queueTitle: {
    color: '#fff',
    fontSize: 13,
    textAlign: 'left',
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

  pageTitle: {
    fontFamily: Platform.OS === 'web' ? 'Fredoka' : 'System',
    fontSize: 26,
    fontWeight: '700',
    color: YELLOW,
    textAlign: 'center',
    marginBottom: 20,
  },
  queueAvatarInitial: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  queueAvatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  hostActions: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  colTitle: { width: 140 },
  colArtist: { width: 100 },
  colGenre: { width: 70 },
  colDuration: { width: 70 },
});
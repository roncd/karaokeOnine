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
  catalogueScroll: {
    paddingBottom: 32,
    gap: 4,
  },
  catalogueHero: {
    marginBottom: 8,
    position: 'relative',
  },
  heroStar: {
    position: 'absolute',
    top: -6,
    right: 8,
    zIndex: 0,
  },
  catalogueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  catalogueTitle: {
    color: YELLOW,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 1,
    ...Platform.select({
      web: {
        fontFamily: '"Fredoka", "Nunito", "Varela Round", sans-serif',
        lineHeight: 38,
      },
      default: {},
    }),
  },
  catalogueSubtitle: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.72)',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 520,
    ...Platform.select({
      web: { fontFamily: '"Inter", sans-serif' },
      default: {},
    }),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    marginBottom: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(245,230,66,0.35)',
  },
  searchBarIcon: {
    color: YELLOW,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
  },
  searchBarText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 15,
    flex: 1,
    ...Platform.select({
      web: { fontFamily: '"Inter", sans-serif' },
      default: {},
    }),
  },
  genreSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  genreSectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
    ...Platform.select({
      web: { fontFamily: '"Inter", sans-serif' },
      default: {},
    }),
  },
  genreSectionCount: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 13,
    ...Platform.select({
      web: { fontFamily: '"Inter", sans-serif' },
      default: {},
    }),
  },
  searchIcon: { fontSize: 20 },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  genreCard: {
    backgroundColor: CARD,
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    overflow: 'hidden',
    minHeight: 148,
    justifyContent: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'transform 0.15s ease',
      },
      default: {},
    }),
  },
  genreAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  genreIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    borderWidth: 1,
  },
  genreShort: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.6,
    ...Platform.select({
      web: { fontFamily: '"Inter", sans-serif' },
      default: {},
    }),
  },
  genreLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
    textAlign: 'center',
    ...Platform.select({
      web: { fontFamily: '"Inter", sans-serif' },
      default: {},
    }),
  },
  genreExplore: {
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.9,
  },
  popularSection: {
    marginTop: 24,
  },
  audioPanel: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 4,
    padding: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(245,230,66,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245,230,66,0.45)',
    gap: 10,
  },
  audioStatusPending: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  audioStatusDotPending: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FBBF24',
  },
  audioStatusPendingText: {
    color: YELLOW,
    fontSize: 14,
    fontWeight: '800',
    ...Platform.select({
      web: { fontFamily: '"Inter", sans-serif' },
      default: {},
    }),
  },
  audioPanelHint: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 13,
    lineHeight: 19,
    ...Platform.select({
      web: { fontFamily: '"Inter", sans-serif' },
      default: {},
    }),
  },
  audioActivateBtn: {
    marginTop: 4,
    backgroundColor: YELLOW,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  audioActivateBtnLoading: {
    opacity: 0.85,
  },
  audioActivateBtnText: {
    color: '#0D0D0D',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.3,
    ...Platform.select({
      web: { fontFamily: '"Inter", sans-serif' },
      default: {},
    }),
  },
  audioStatusActive: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(74,222,128,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(74,222,128,0.35)',
  },
  audioStatusDotOn: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4ADE80',
  },
  audioStatusActiveText: {
    flex: 1,
    color: '#BBF7D0',
    fontSize: 13,
    fontWeight: '700',
    ...Platform.select({
      web: { fontFamily: '"Inter", sans-serif' },
      default: {},
    }),
  },
  micBar: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  micBarOn: {
    borderColor: 'rgba(245,230,66,0.45)',
    backgroundColor: 'rgba(245,230,66,0.08)',
  },
  micBarDisabled: {
    opacity: 0.55,
  },
  micIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  micIndicatorOn: {
    backgroundColor: '#4ADE80',
  },
  micIndicatorOff: {
    backgroundColor: '#EF4444',
  },
  micTextWrap: {
    flex: 1,
    gap: 2,
  },
  micTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    ...Platform.select({
      web: { fontFamily: '"Inter", sans-serif' },
      default: {},
    }),
  },
  micSubtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    ...Platform.select({
      web: { fontFamily: '"Inter", sans-serif' },
      default: {},
    }),
  },
  micGlyph: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  micGlyphMuted: {
    opacity: 0.55,
  },
  micGlyphHead: {
    width: 10,
    height: 14,
    borderRadius: 5,
    backgroundColor: YELLOW,
    marginTop: 2,
  },
  micGlyphArc: {
    width: 16,
    height: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: YELLOW,
    marginTop: -1,
  },
  micGlyphStem: {
    width: 2,
    height: 5,
    backgroundColor: YELLOW,
    marginTop: 1,
  },
  micGlyphSlash: {
    position: 'absolute',
    width: 2,
    height: 30,
    backgroundColor: '#EF4444',
    transform: [{ rotate: '-45deg' }],
    top: -1,
    left: 13,
    borderRadius: 1,
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 16,
    maxHeight: '85%',
    borderTopWidth: 1,
    borderColor: 'rgba(245,230,66,0.25)',
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
    borderRadius: 12,
    color: '#fff',
    fontSize: 15,
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
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
    opacity: 0.75,
    textAlign: 'right',
  },
  songItemAction: {
    alignItems: 'flex-end',
    gap: 6,
    marginLeft: 12,
  },
  songItemAddBtn: {
    backgroundColor: 'rgba(245,230,66,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245,230,66,0.45)',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  songItemAddText: {
    color: YELLOW,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
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
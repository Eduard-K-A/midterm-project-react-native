import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  // ── Root container — safe area insets applied in JSX ──────────────────────
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // ── Page header (title + theme toggle) ────────────────────────────────────
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    marginBottom: 16,
  },
  headerText: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.7,
    lineHeight: 34,
    fontFamily: 'Sora_700Bold',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
    letterSpacing: 0.1,
  },

  // ── Saved-count badge pill ─────────────────────────────────────────────────
  countBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 12,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // ── Scrollable list container ─────────────────────────────────────────────
  listContent: {
    paddingTop: 6,
  },

  // ── Card wrapper with the Remove button pinned below each card ────────────
  cardWrapper: {
    marginBottom: 4,
  },
  removeBtn: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1.5,
    marginTop: 4,
    marginBottom: 12,
  },
  removeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
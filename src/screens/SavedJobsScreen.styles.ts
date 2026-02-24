import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // ── Header ────────────────────────────────────────────────────
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerText: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 3,
    lineHeight: 18,
  },

  // ── Count badge ───────────────────────────────────────────────
  countBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
    marginBottom: 10,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // ── List ──────────────────────────────────────────────────────
  listContent: {
    paddingTop: 4,
  },

  // ── Card wrapper + remove ─────────────────────────────────────
  cardWrapper: {
    marginBottom: 4,
  },
  removeBtn: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 50,
    borderWidth: 1,
    marginTop: 6,
    marginBottom: 10,
  },
  removeBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
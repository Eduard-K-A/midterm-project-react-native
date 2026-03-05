import { StyleSheet } from 'react-native';
const CARD_RADIUS = 18;
const LOGO_SIZE = 50;

export const styles = StyleSheet.create({
  card: {
    borderRadius: CARD_RADIUS,
    padding: 16,
    marginBottom: 14,
    borderWidth: StyleSheet.hairlineWidth,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',  
    marginBottom: 12,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: LOGO_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoImage: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: 10,
    resizeMode: 'contain',
    marginRight: 12,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 18,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  saveButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  saveButtonText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  applyButton: {
    flex: 2,             
    borderRadius: 999,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

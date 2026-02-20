import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    resizeMode: 'cover',
    marginRight: 8,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chipText: {
    fontSize: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  saveButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});


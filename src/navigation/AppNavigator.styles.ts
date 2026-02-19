import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    paddingBottom: 6,
    paddingTop: 6,
    height: 64,
  },
  tabLabel: {
    fontSize: 12,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -12,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});


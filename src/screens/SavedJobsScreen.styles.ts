import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
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

  // mirrors JobFinder's searchWrapper
  searchWrapper: {
    marginBottom: 6,
  },

  // mirrors JobFinder's resultCount exactly
  countText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 10,
    paddingHorizontal: 2,
  },

  listContent: {
    paddingTop: 6,
  },
  cardWrapper: {
    marginBottom: 4,
  },
});
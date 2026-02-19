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
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  skeletonContainer: {
    marginTop: 8,
  },
  errorContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    marginBottom: 8,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  footerLoader: {
    marginVertical: 12,
  },
});


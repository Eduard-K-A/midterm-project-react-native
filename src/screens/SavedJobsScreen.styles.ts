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
  listContent: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  cardWrapper: {
    marginBottom: 8,
  },
  removeText: {
    fontSize: 13,
    marginLeft: 4,
    marginBottom: 8,
  },
});


import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { styles } from './EmptyState.styles';

interface EmptyStateProps {
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textMuted }]}>{description}</Text>
    </View>
  );
};

export default EmptyState;


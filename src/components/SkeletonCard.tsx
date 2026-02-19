import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { styles } from './SkeletonCard.styles';

const SkeletonCard: React.FC = () => {
  const { colors } = useTheme();
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();

    return () => {
      loop.stop();
    };
  }, [shimmer]);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          shadowColor: colors.shadow,
          opacity,
        },
      ]}
    >
      <View style={[styles.logoPlaceholder, { backgroundColor: colors.border }]} />
      <View style={styles.textBlock}>
        <View style={[styles.line, { width: '70%', backgroundColor: colors.border }]} />
        <View style={[styles.line, { width: '50%', backgroundColor: colors.border }]} />
        <View style={[styles.chip, { backgroundColor: colors.border }]} />
      </View>
    </Animated.View>
  );
};

export default SkeletonCard;


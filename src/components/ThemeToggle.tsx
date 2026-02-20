import React, { useEffect, useRef } from 'react';
import { Pressable, Animated, Easing, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { styles } from './ThemeToggle.styles';

const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme, colors } = useTheme();
  const rotateAnim = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isDark ? 1 : 0,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isDark, rotateAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const handlePress = () => {
    // toggle theme immediately so UI updates without delay
    toggleTheme();
    Animated.spring(rotateAnim, {
      toValue: isDark ? 0 : 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <Animated.View style={[styles.iconWrapper, { transform: [{ rotate: rotation }] }]}>
        <View style={styles.iconInner}>
          <Ionicons
            name={isDark ? ('moon' as never) : ('sunny' as never)}
            size={18}
            color={colors.primary}
          />
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default ThemeToggle;


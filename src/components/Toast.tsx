import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { styles } from './Toast.styles';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  visible: boolean;
  message: string;
  type?: ToastType;
}

const ICONS: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};

const Toast: React.FC<ToastProps> = ({ visible, message, type = 'info' }) => {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 20,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => setMounted(false));
    }
  }, [visible, opacity, translateY]);

  if (!mounted) return null;

  const bgColor =
    type === 'success'
      ? colors.success
      : type === 'error'
      ? colors.destructive
      : colors.primary;

  const textColor =
    type === 'success'
      ? colors.onSuccess ?? '#FFFFFF'
      : type === 'error'
      ? colors.onDestructive ?? '#FFFFFF'
      : colors.onPrimary ?? '#FFFFFF';

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          shadowColor: bgColor,
          opacity,
          transform: [{ translateY }],
        },
      ]}
      pointerEvents="none"
    >
      <Text style={[styles.icon, { color: textColor }]}>{ICONS[type]}</Text>
      <Text style={[styles.message, { color: textColor }]}>{message}</Text>
    </Animated.View>
  );
};

export default Toast;


import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { styles } from './SuccessModal.styles';

interface SuccessModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ visible, title = 'Application Submitted! ✅', message, onClose }) => {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.backdrop, { backgroundColor: colors.overlay }]}>
        <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {message ? <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text> : null}
          <Pressable style={[styles.button, { backgroundColor: colors.primary }]} onPress={onClose}>
            <Text style={{ color: colors.onPrimary }}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;

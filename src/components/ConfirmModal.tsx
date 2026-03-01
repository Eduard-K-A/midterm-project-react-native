import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { styles } from './ConfirmModal.styles';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ visible, title, message, onConfirm, onCancel }) => {
  const { colors } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={[styles.backdrop, { backgroundColor: colors.overlay }]}>
        <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}> 
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
          <View style={styles.actions}>
            <Pressable style={[styles.cancelButton, { borderColor: colors.border }]} onPress={onCancel}>
              <Text style={{ color: colors.text }}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.confirmButton, { backgroundColor: colors.destructive }]} onPress={onConfirm}>
              <Text style={{ color: colors.onDestructive }}>Remove</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;

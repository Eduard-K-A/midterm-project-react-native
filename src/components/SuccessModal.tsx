import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/useTheme';

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

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  container: { width: '100%', borderRadius: 12, padding: 16, borderWidth: 1, alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  message: { fontSize: 14, marginBottom: 16, textAlign: 'center' },
  button: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
});

export default SuccessModal;

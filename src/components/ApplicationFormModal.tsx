import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApplicationFormModalProps, ApplicationFormData } from '../types';
import { applicationSchema } from '../utils/validators';
import { useTheme } from '../hooks/useTheme';
import { styles } from './ApplicationFormModal.styles';
import SuccessModal from './SuccessModal';

const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({
  visible,
  job,
  onClose,
  onSuccess,
  sourceScreen,
}) => {
  const { colors } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    watch,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    mode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      contactNumber: '+63',
      whyShouldWeHireYou: '',
    },
  });

  const whyValue = watch('whyShouldWeHireYou');
  const characterCount = useMemo(() => whyValue.length, [whyValue]);

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const onSubmit = async (data: ApplicationFormData) => {
    try {
      // show immediate feedback
      setLocalLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 800));

      reset();
      onSuccess();
      setSuccessVisible(true);
    } catch {
      // set errors via form state - keep simple here
    } finally {
      setLocalLoading(false);
    }
  };

  const [localLoading, setLocalLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        style={[styles.flex, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Apply for {job?.title ?? 'Job'}
            </Text>
            <Text style={[styles.headerSubtitle, { color: colors.textMuted }]} numberOfLines={1}>
              {job?.companyName}
            </Text>
          </View>
          <Pressable
            onPress={handleClose}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close" size={22} color={colors.textMuted} />
          </Pressable>
        </View>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Full Name</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: errors.name ? colors.destructive : colors.border,
                      color: colors.text,
                      backgroundColor: colors.surface,
                    },
                  ]}
                  placeholder="Your full name"
                  placeholderTextColor={colors.textMuted}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.name?.message && (
              <Text style={[styles.errorText, { color: colors.destructive }]}>
                {errors.name.message}
              </Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Email Address</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: errors.email ? colors.destructive : colors.border,
                      color: colors.text,
                      backgroundColor: colors.surface,
                    },
                  ]}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.textMuted}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
            {errors.email?.message && (
              <Text style={[styles.errorText, { color: colors.destructive }]}>
                {errors.email.message}
              </Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Contact Number</Text>
            <Controller
              control={control}
              name="contactNumber"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: errors.contactNumber ? colors.destructive : colors.border,
                      color: colors.text,
                      backgroundColor: colors.surface,
                    },
                  ]}
                  placeholder="+63XXXXXXXXXX"
                  placeholderTextColor={colors.textMuted}
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    let next = String(text ?? '');
                    // ensure prefix +63 is enforced
                    const digits = next.replace(/[^0-9]/g, '');
                    if (next.startsWith('+63')) {
                      next = '+63' + digits.slice(2);
                    } else if (digits.startsWith('63')) {
                      next = '+' + digits;
                    } else {
                      // strip leading zeros
                      const local = digits.replace(/^0+/, '');
                      next = '+63' + local;
                    }
                    onChange(next);
                  }}
                  value={value}
                  keyboardType="phone-pad"
                />
              )}
            />
            {errors.contactNumber?.message && (
              <Text style={[styles.errorText, { color: colors.destructive }]}>
                {errors.contactNumber.message}
              </Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: colors.text }]}>Why Should We Hire You?</Text>
              <Text style={[styles.charCount, { color: colors.textMuted }]}>
                {characterCount}/1000
              </Text>
            </View>
            <Controller
              control={control}
              name="whyShouldWeHireYou"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[
                    styles.textArea,
                    {
                      borderColor: errors.whyShouldWeHireYou ? colors.destructive : colors.border,
                      color: colors.text,
                      backgroundColor: colors.surface,
                    },
                  ]}
                  placeholder="Tell us about your experience, strengths, and why you are a great fit for this role."
                  placeholderTextColor={colors.textMuted}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                  textAlignVertical="top"
                />
              )}
            />
            {errors.whyShouldWeHireYou?.message && (
              <Text style={[styles.errorText, { color: colors.destructive }]}>
                {errors.whyShouldWeHireYou.message}
              </Text>
            )}
          </View>
        </ScrollView>
        <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <Pressable
              style={[
                styles.submitButton,
                {
                  backgroundColor: isValid && !localLoading ? colors.primary : colors.border,
                },
              ]}
              disabled={!isValid || localLoading}
              onPress={handleSubmit(onSubmit)}
            >
              {localLoading ? (
                <ActivityIndicator color={colors.onPrimary} />
              ) : (
                <Text style={[styles.submitButtonText, { color: colors.onPrimary }]}>Submit Application</Text>
              )}
            </Pressable>
        </View>
      </KeyboardAvoidingView>
      <SuccessModal
        visible={successVisible}
        message={`Good luck with your application for ${job?.title ?? 'the role'} at ${job?.companyName ?? ''}`}
        onClose={() => {
          setSuccessVisible(false);
          onClose();
        }}
      />
    </Modal>
  );
};

export default ApplicationFormModal;


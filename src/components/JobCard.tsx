import React, { useMemo } from 'react';
import { View, Text, Pressable, GestureResponderEvent } from 'react-native';
import { Job } from '../types';
import { useTheme } from '../hooks/useTheme';
import { formatCurrency, getInitials } from '../utils/helpers';
import { useAppDispatch, useAppSelector } from '../store';
import { saveJob, selectIsJobSaved } from '../store/savedJobsSlice';
import { styles } from './JobCard.styles';

interface JobCardProps {
  job: Job;
  onApplyPress: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApplyPress }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const isSaved = useAppSelector(selectIsJobSaved(job.id));

  const salaryLabel = useMemo(() => formatCurrency(job.salary), [job.salary]);

  const handleSavePress = (_event: GestureResponderEvent) => {
    if (!isSaved) {
      dispatch(saveJob(job));
    }
  };

  const handleApplyPress = (_event: GestureResponderEvent) => {
    onApplyPress(job);
  };

  const initials = useMemo(() => getInitials(job.company), [job.company]);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadow,
        },
      ]}
    >
      <View style={[styles.headerRow]}>
        <View style={[styles.logo, { backgroundColor: colors.primary }]}>
          <Text style={[styles.logoText, { color: '#FFFFFF' }]}>{initials}</Text>
        </View>
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {job.title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]} numberOfLines={1}>
            {job.company} • {job.location}
          </Text>
          <View style={styles.chipRow}>
            {salaryLabel && (
              <View style={[styles.badge, { borderColor: colors.primary }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>{salaryLabel}</Text>
              </View>
            )}
            {job.type && (
              <View style={[styles.chip, { backgroundColor: colors.background }]}>
                <Text style={[styles.chipText, { color: colors.textMuted }]}>{job.type}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={styles.actionsRow}>
        <Pressable
          style={[
            styles.saveButton,
            {
              backgroundColor: isSaved ? colors.success : 'transparent',
              borderColor: isSaved ? colors.success : colors.border,
            },
          ]}
          onPress={handleSavePress}
        >
          <Text
            style={[
              styles.saveButtonText,
              { color: isSaved ? '#0A0F1E' : colors.text },
            ]}
          >
            {isSaved ? '✓ Saved' : 'Save Job'}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.applyButton, { backgroundColor: colors.primary }]}
          onPress={handleApplyPress}
        >
          <Text style={[styles.applyButtonText, { color: '#FFFFFF' }]}>Apply</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default JobCard;


import React, { useMemo } from 'react';
import { View, Text, Pressable, GestureResponderEvent, Image } from 'react-native';
import { Job } from '../types';
import { useTheme } from '../hooks/useTheme';
import { formatSalary, getInitials } from '../utils/helpers';
import { useAppDispatch, useAppSelector } from '../store';
import { persistSaveJob, persistRemoveJob, selectIsJobSaved } from '../store/savedJobsSlice';
import { styles } from './JobCard.styles';
import { useNavigation } from '@react-navigation/native';
import ConfirmModal from './ConfirmModal';

interface JobCardProps {
  job: Job;
  onApplyPress: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApplyPress }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const isSaved = useAppSelector(selectIsJobSaved(job.guid));

  const salaryLabel = useMemo(
    () => formatSalary(job.minSalary, job.maxSalary, job.currency),
    [job.minSalary, job.maxSalary, job.currency],
  );

  const handleSavePress = (_event: GestureResponderEvent) => {
    if (!isSaved) {
      dispatch(persistSaveJob(job));
    } else {
      setConfirmVisible(true);
    }
  };

  const handleApplyPress = (_event: GestureResponderEvent) => {
    onApplyPress(job);
  };

  const handleCardPress = () => {
    // navigate to detail screen with job payload
    // @ts-ignore - navigation typing from different navigators
    navigation.navigate('JobDetail', { job });
  };

  const initials = useMemo(() => getInitials(job.companyName), [job.companyName]);
  const [confirmVisible, setConfirmVisible] = React.useState(false);

  const handleConfirmRemove = () => {
    dispatch(persistRemoveJob(job.guid));
    setConfirmVisible(false);
  };

  return (
    <>
      <Pressable onPress={handleCardPress} style={{ marginBottom: 16 }} android_ripple={{ color: colors.overlay }}>
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
         </View>
      <View style={[styles.headerRow]}>
        {job.companyLogo ? (
          <Image source={{ uri: job.companyLogo }} style={styles.logoImage} />
        ) : (
          <View style={[styles.logo, { backgroundColor: colors.primary }]}>
            <Text style={[styles.logoText, { color: colors.onPrimary }]}>{initials}</Text>
          </View>
        )}
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {job.title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]} numberOfLines={1}>
            {job.companyName} • {job.locations?.join(', ')}
          </Text>
          <View style={styles.chipRow}>
            {salaryLabel && (
              <View style={[styles.badge, { borderColor: colors.primary }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>{salaryLabel}</Text>
              </View>
            )}
            {job.jobType && (
              <View style={[styles.chip, { backgroundColor: colors.background }]}>
                <Text style={[styles.chipText, { color: colors.textMuted }]}>{job.jobType}</Text>
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
          android_ripple={{ color: colors.border }}
        >
          <Text style={[styles.saveButtonText, { color: isSaved ? colors.onSuccess : colors.text }]}>
            {isSaved ? '✓ Saved' : 'Save'}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.applyButton, { backgroundColor: colors.primary }]}
          onPress={handleApplyPress}
          android_ripple={{ color: colors.overlay }}
        >
          <Text style={[styles.applyButtonText, { color: colors.onPrimary }]}>
            Apply
          </Text>
        </Pressable>
      </View>
    </Pressable>
      <ConfirmModal
        visible={confirmVisible}
        title="Remove this job from saved?"
        message={`Remove ${job.title} from saved jobs?`}
        onConfirm={handleConfirmRemove}
        onCancel={() => setConfirmVisible(false)}
      />
    </>
  );
};

export default JobCard;


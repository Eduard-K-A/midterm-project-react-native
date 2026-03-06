import React, { useMemo } from 'react';
import { View, Text, Pressable, GestureResponderEvent, Image } from 'react-native';
import { Job } from '../types';
import { useTheme } from '../hooks/useTheme';
import { formatSalary, getInitials } from '../utils/helpers';
import { useAppDispatch, useAppSelector } from '../store';
import { persistSaveJob, persistRemoveJob, selectIsJobSaved } from '../store/savedJobsSlice';
import { selectIsJobApplied } from '../store/appliedJobsSlice';
import { styles } from './JobCard.styles';
import { useNavigation } from '@react-navigation/native';
import ConfirmModal from './ConfirmModal';
import { useToast } from '../context/ToastContext';

interface LeftAction {
  label: string;
  onPress: () => void;
  color: string;
}

interface JobCardProps {
  job: Job;
  onApplyPress: (job: Job) => void;
  leftAction?: LeftAction;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApplyPress, leftAction }) => {
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { showToast } = useToast();

  // These selectors are memoised — they only re-run when the relevant
  // slice of the Redux store changes, not on every render
  const isSaved = useAppSelector(selectIsJobSaved(job.guid));
  const isApplied = useAppSelector(selectIsJobApplied(job.guid));

  // useMemo prevents formatSalary from being called on every render;
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
    if (isApplied) {
      showToast('Already Applied', 'info');
    } else {
      onApplyPress(job);
    }
  };

  const handleCardPress = () => {
    // @ts-ignore - navigation typing varies between stack navigators
    navigation.navigate('JobDetail', { job });
  };


  const initials = useMemo(() => getInitials(job.companyName), [job.companyName]);
  const [confirmVisible, setConfirmVisible] = React.useState(false);

  const handleConfirmRemove = () => {
    // persistRemoveJob removes entry from both Redux store and AsyncStorage
    dispatch(persistRemoveJob(job.guid));
    setConfirmVisible(false);
  };

  return (
    <>
      <Pressable
        onPress={handleCardPress}
        style={{ marginBottom: 14 }}
        android_ripple={{ color: colors.overlay }}
        accessibilityRole="button"
        accessibilityLabel={`View details for ${job.title} at ${job.companyName}`}
      >
    
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              shadowColor: colors.shadow,
            },
          ]}
        />
            {/* Company logo*/}
        <View style={styles.headerRow}>
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

            {/* Salary badge + job type chip */}
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

        {/* Action buttons */}
        <View style={styles.actionsRow}>
          {leftAction ? (
            <Pressable
              style={[
                styles.saveButton,
                {
                  backgroundColor: 'transparent',
                  borderColor: leftAction.color,
                },
              ]}
              onPress={leftAction.onPress}
              android_ripple={{ color: colors.border }}
              accessibilityLabel={leftAction.label}
              accessibilityRole="button"
            >
              <Text style={[styles.saveButtonText, { color: leftAction.color }]}> 
                {leftAction.label}
              </Text>
            </Pressable>
          ) : (
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
              accessibilityLabel={isSaved ? `Unsave ${job.title}` : `Save ${job.title}`}
              accessibilityRole="button"
            >
              <Text style={[styles.saveButtonText, { color: isSaved ? colors.onSuccess : colors.text }]}>
                {isSaved ? '✓ Saved' : 'Save'}
              </Text>
            </Pressable>
          )}

          {/* Apply button — muted when already applied, primary CTA otherwise */}
          <Pressable
            style={[
              styles.applyButton,
              { backgroundColor: isApplied ? colors.border : colors.primary },
            ]}
            onPress={handleApplyPress}
            android_ripple={{ color: colors.overlay }}
            accessibilityLabel={isApplied ? 'Already applied' : `Apply to ${job.title}`}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.applyButtonText,
                { color: isApplied ? colors.textMuted : colors.onPrimary },
              ]}
            >
              {isApplied ? '✓ Already Applied' : 'Apply'}
            </Text>
          </Pressable>
        </View>
      </Pressable>

      {/* Confirm modal — shown when user tries to unsave a bookmarked job */}
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

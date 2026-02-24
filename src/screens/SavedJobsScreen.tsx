import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Platform,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';
import ThemeToggle from '../components/ThemeToggle';
import EmptyState from '../components/EmptyState';
import { useAppDispatch, useAppSelector } from '../store';
import { selectSavedJobs, persistRemoveJob } from '../store/savedJobsSlice';
import ConfirmModal from '../components/ConfirmModal';
import JobCard from '../components/JobCard';
import ApplicationFormModal from '../components/ApplicationFormModal';
import { Job } from '../types';
import { styles } from './SavedJobsScreen.styles';

const SavedJobsScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const savedJobs = useAppSelector(selectSavedJobs);
  const dispatch = useAppDispatch();

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<Job | null>(null);

  const handleApplyPress = useCallback((job: Job) => {
    setSelectedJob(job);
    setModalVisible(true);
  }, []);

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedJob(null);
  };

  const handleRemoveJob = (job: Job) => {
    setPendingRemove(job);
    setConfirmVisible(true);
  };

  const handleConfirmRemove = () => {
    if (pendingRemove) {
      dispatch(persistRemoveJob(pendingRemove.guid));
    }
    setPendingRemove(null);
    setConfirmVisible(false);
  };

  const renderItem = ({ item }: { item: Job }) => (
    <View style={styles.cardWrapper}>
      <JobCard job={item} onApplyPress={handleApplyPress} />
      <Pressable
        style={({ pressed }) => [
          styles.removeBtn,
          { borderColor: colors.destructive },
          pressed && { opacity: 0.6 },
        ]}
        onPress={() => handleRemoveJob(item)}
        android_ripple={{ color: colors.overlay }}
        accessibilityLabel={`Remove ${item.title} from saved jobs`}
      >
        <Text style={[styles.removeBtnText, { color: colors.destructive }]}>
          ✕  Remove
        </Text>
      </Pressable>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + (Platform.OS === 'ios' ? 8 : 12),
        },
      ]}
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>Saved Jobs</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Roles you're keeping an eye on
          </Text>
        </View>
        <ThemeToggle />
      </View>

      {/* ── Count badge ────────────────────────────────────────── */}
      {savedJobs.length > 0 && (
        <View style={[styles.countBadge, { backgroundColor: colors.overlay }]}>
          <Text style={[styles.countText, { color: colors.textMuted }]}>
            {savedJobs.length} saved {savedJobs.length === 1 ? 'job' : 'jobs'}
          </Text>
        </View>
      )}

      {/* ── List / Empty ───────────────────────────────────────── */}
      {savedJobs.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          description="Tap the save button on any job listing to keep it here for later."
        />
      ) : (
        <FlatList
          data={savedJobs}
          keyExtractor={(item) => item.guid}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 16 },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}

      <ConfirmModal
        visible={confirmVisible}
        title="Remove saved job?"
        message={`Remove "${pendingRemove?.title ?? 'this job'}" from your saved list?`}
        onConfirm={handleConfirmRemove}
        onCancel={() => {
          setPendingRemove(null);
          setConfirmVisible(false);
        }}
      />

      <ApplicationFormModal
        visible={modalVisible}
        job={selectedJob}
        onClose={handleModalClose}
        onSuccess={() => {}}
        sourceScreen="SavedJobs"
      />
    </View>
  );
};

export default SavedJobsScreen;
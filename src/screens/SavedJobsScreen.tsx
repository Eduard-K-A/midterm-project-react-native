import React, { useCallback, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
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

  const handleApplyPress = useCallback((job: Job) => {
    setSelectedJob(job);
    setModalVisible(true);
  }, []);

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedJob(null);
  };

  const handleModalSuccess = () => {};

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<Job | null>(null);

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

  const handleCancelRemove = () => {
    setPendingRemove(null);
    setConfirmVisible(false);
  };

  const renderItem = ({ item }: { item: Job }) => (
    <View style={styles.cardWrapper}>
      <JobCard job={item} onApplyPress={handleApplyPress} />
      <Text
        style={[styles.removeText, { color: colors.destructive }]}
        onPress={() => handleRemoveJob(item)}
      >
        Remove from saved
      </Text>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 12,
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Saved Jobs</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Keep track of roles you care about
          </Text>
        </View>
        <ThemeToggle />
      </View>

      {savedJobs.length === 0 ? (
        <EmptyState
          title="No saved jobs yet"
          description="Any job you save will appear here for quick access when you are ready to apply."
        />
      ) : (
        <FlatList
          data={savedJobs}
          keyExtractor={(item) => item.guid}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}

      <ConfirmModal
        visible={confirmVisible}
        title="Remove this job from saved?"
        message={`Are you sure you want to remove ${pendingRemove?.title ?? 'this job'} from saved jobs?`}
        onConfirm={handleConfirmRemove}
        onCancel={handleCancelRemove}
      />

      <ApplicationFormModal
        visible={modalVisible}
        job={selectedJob}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        sourceScreen="SavedJobs"
      />
    </View>
  );
};

export default SavedJobsScreen;


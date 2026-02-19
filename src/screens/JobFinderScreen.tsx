import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchJobs, selectFilteredJobs, selectJobsState, setSearchQuery } from '../store/jobsSlice';
import { useTheme } from '../hooks/useTheme';
import SearchBar from '../components/SearchBar';
import SkeletonCard from '../components/SkeletonCard';
import EmptyState from '../components/EmptyState';
import JobCard from '../components/JobCard';
import ThemeToggle from '../components/ThemeToggle';
import ApplicationFormModal from '../components/ApplicationFormModal';
import { Job } from '../types';
import { styles } from './JobFinderScreen.styles';

const JobFinderScreen: React.FC = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const jobsState = useAppSelector(selectJobsState);
  const jobs = useAppSelector(selectFilteredJobs);

  const [localQuery, setLocalQuery] = useState<string>('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setSearchQuery(localQuery));
  }, [localQuery, dispatch]);

  const onRefresh = useCallback(() => {
    dispatch(fetchJobs());
  }, [dispatch]);

  const handleApplyPress = useCallback((job: Job) => {
    setSelectedJob(job);
    setModalVisible(true);
  }, []);

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedJob(null);
  };

  const handleModalSuccess = () => {};

  const renderItem = ({ item }: { item: Job }) => (
    <JobCard job={item} onApplyPress={handleApplyPress} />
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
          <Text style={[styles.title, { color: colors.text }]}>Market Pulse Jobs</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Curated roles in tech & finance
          </Text>
        </View>
        <ThemeToggle />
      </View>

      <SearchBar
        value={localQuery}
        onChangeText={setLocalQuery}
        placeholder="Search by title, company, or location"
      />

      {jobsState.loading && jobs.length === 0 ? (
        <View style={styles.skeletonContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </View>
      ) : jobsState.error ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.destructive }]}>
            {jobsState.error}
          </Text>
          <Text
            style={[styles.retryText, { color: colors.primary }]}
            onPress={() => dispatch(fetchJobs())}
          >
            Tap to retry
          </Text>
        </View>
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No roles found"
          description="Try a different search term or clear your filters to see more opportunities."
        />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={jobsState.loading}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          ListFooterComponent={
            jobsState.loading ? (
              <ActivityIndicator style={styles.footerLoader} color={colors.primary} />
            ) : null
          }
        />
      )}

      <ApplicationFormModal
        visible={modalVisible}
        job={selectedJob}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        sourceScreen="JobFinder"
      />
    </View>
  );
};

export default JobFinderScreen;


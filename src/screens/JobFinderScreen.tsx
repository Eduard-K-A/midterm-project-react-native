import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
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

  const renderItem = ({ item }: { item: Job }) => (
    <JobCard job={item} onApplyPress={handleApplyPress} />
  );

  const isInitialLoad = jobsState.loading && jobs.length === 0;

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
          <Text style={[styles.title, { color: colors.text }]}>Market Pulse</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Curated roles in tech & finance
          </Text>
        </View>
        <ThemeToggle />
      </View>

      {/* ── Search ─────────────────────────────────────────────── */}
      <View style={styles.searchWrapper}>
        <SearchBar
          value={localQuery}
          onChangeText={setLocalQuery}
          placeholder="Search title, company, or location…"
        />
      </View>

      {/* ── Results count ──────────────────────────────────────── */}
      {!isInitialLoad && !jobsState.error && jobs.length > 0 && (
        <Text style={[styles.resultCount, { color: colors.textMuted }]}>
          {jobs.length} {jobs.length === 1 ? 'role' : 'roles'} found
          {localQuery.trim() ? ` for "${localQuery.trim()}"` : ''}
        </Text>
      )}

      {/* ── States ─────────────────────────────────────────────── */}
      {isInitialLoad ? (
        <View style={styles.skeletonContainer}>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : jobsState.error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={[styles.errorTitle, { color: colors.text }]}>Something went wrong</Text>
          <Text style={[styles.errorText, { color: colors.textMuted }]}>{jobsState.error}</Text>
          <Text
            style={[styles.retryBtn, { color: colors.primary, borderColor: colors.primary }]}
            onPress={() => dispatch(fetchJobs())}
          >
            Try again
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
          keyExtractor={(item) => item.guid}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 16 },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={jobsState.loading}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
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
        onSuccess={() => {}}
        sourceScreen="JobFinder"
      />
    </View>
  );
};

export default JobFinderScreen;
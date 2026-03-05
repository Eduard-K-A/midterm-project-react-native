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
import {
  fetchJobs,
  selectFilteredJobs,
  selectJobsState,
  setSearchQuery,
  selectIsCacheValid,
} from '../store/jobsSlice';
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
  // useSafeAreaInsets gives us the device's notch/status-bar insets so we
  // can pad the content without overlapping system UI
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const jobsState = useAppSelector(selectJobsState);

  // selectFilteredJobs is a memoised createSelector that filters the full
  // jobs array by the search query stored in Redux — avoids re-computation
  const jobs = useAppSelector(selectFilteredJobs);

  // Cache guard: we only re-fetch if more than 5 minutes have passed since
  // the last successful fetch (see CACHE_DURATION_MS in jobsSlice)
  const isCacheValid = useAppSelector(selectIsCacheValid);

  // localQuery drives the SearchBar UI; we sync it to Redux via useEffect
  // keeping the text input snappy while debouncing Redux state isn't needed
  const [localQuery, setLocalQuery] = useState<string>('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Fetch on mount only when the in-memory/Redux cache is stale
  useEffect(() => {
    if (!isCacheValid) {
      dispatch(fetchJobs(false));
    }
  }, [dispatch, isCacheValid]);

  // Mirror local search text into Redux so selectFilteredJobs updates
  useEffect(() => {
    dispatch(setSearchQuery(localQuery));
  }, [localQuery, dispatch]);

  // forceRefresh=true bypasses the cache check and always hits the network
  const onRefresh = useCallback(() => {
    dispatch(fetchJobs(true));
  }, [dispatch]);

  const handleApplyPress = useCallback((job: Job) => {
    setSelectedJob(job);
    setModalVisible(true);
  }, []);

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedJob(null);
  };

  // renderItem is defined outside the return to keep JSX readable and avoid
  // creating a new function reference on every render cycle
  const renderItem = ({ item }: { item: Job }) => (
    <JobCard job={item} onApplyPress={handleApplyPress} />
  );

  // Show skeleton cards only on the very first load (no data yet)
  const isInitialLoad = jobsState.loading && jobs.length === 0;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          // Respect the device's safe area (notch, status bar, etc.)
          paddingTop: insets.top + (Platform.OS === 'ios' ? 8 : 12),
        },
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>Market Pulse</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Curated roles in tech &amp; finance
          </Text>
        </View>
        {/* ThemeToggle uses the ThemeContext internally — no props needed */}
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

      {/* ── Results count (only shown when data is available) ──── */}
      {!isInitialLoad && !jobsState.error && jobs.length > 0 && (
        <Text style={[styles.resultCount, { color: colors.textMuted }]}>
          {jobs.length} {jobs.length === 1 ? 'role' : 'roles'} found
          {localQuery.trim() ? ` for "${localQuery.trim()}"` : ''}
        </Text>
      )}

      {/* ── States (skeleton → error → empty → list) ───────────── */}
      {isInitialLoad ? (
        // Show 5 skeleton placeholder cards while the first fetch is in flight
        <View style={styles.skeletonContainer}>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      ) : jobsState.error ? (
        // Network / server error state with a retry affordance
        <View style={styles.errorContainer}>
          <Text style={styles.errorEmoji}>⚠️</Text>
          <Text style={[styles.errorTitle, { color: colors.text }]}>Something went wrong</Text>
          <Text style={[styles.errorText, { color: colors.textMuted }]}>{jobsState.error}</Text>
          <Text
            style={[styles.retryBtn, { color: colors.primary, borderColor: colors.primary }]}
            onPress={() => dispatch(fetchJobs())}
            accessibilityRole="button"
            accessibilityLabel="Retry fetching jobs"
          >
            Try again
          </Text>
        </View>
      ) : jobs.length === 0 ? (
        // Zero results — could be an empty search or no data at all
        <EmptyState
          title="No roles found"
          description="Try a different search term or clear your filters to see more opportunities."
        />
      ) : (
        // Main list — FlatList virtualises off-screen cards for perf
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
          // Footer spinner shown during background re-fetches (not initial load)
          ListFooterComponent={
            jobsState.loading ? (
              <ActivityIndicator style={styles.footerLoader} color={colors.primary} />
            ) : null
          }
        />
      )}

      {/* ── Application form modal (slides up from bottom) ──────── */}
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
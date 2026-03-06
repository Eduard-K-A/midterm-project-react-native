import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Platform,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../hooks/useTheme";
import ThemeToggle from "../components/ThemeToggle";
import SearchBar from "../components/SearchBar";
import EmptyState from "../components/EmptyState";
import { useAppDispatch, useAppSelector } from "../store";
import { selectSavedJobs, persistRemoveJob } from "../store/savedJobsSlice";
import ConfirmModal from "../components/ConfirmModal";
import JobCard from "../components/JobCard";
import ApplicationFormModal from "../components/ApplicationFormModal";
import { Job } from "../types";
import { styles } from "./SavedJobsScreen.styles";

const SavedJobsScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const savedJobs = useAppSelector(selectSavedJobs);
  const dispatch = useAppDispatch();

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<Job | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // query for filtering saved jobs; shown only when there is at least one saved job
  const [searchQuery, setSearchQuery] = useState("");

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  }, []);

  const handleApplyPress = useCallback((job: Job) => {
    setSelectedJob(job);
    setModalVisible(true);
  }, []);

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedJob(null);
  };

  const handleRemoveJob = (job: Job) => {
    // Stage the job for removal; wait for user confirmation in ConfirmModal
    setPendingRemove(job);
    setConfirmVisible(true);
  };

  const handleConfirmRemove = () => {
    // persistRemoveJob removes from both Redux state and AsyncStorage
    if (pendingRemove) {
      dispatch(persistRemoveJob(pendingRemove.guid));
    }
    setPendingRemove(null);
    setConfirmVisible(false);
  };

  // renderItem is extracted here to avoid an inline arrow function in the
  // FlatList prop which would cause unnecessary re-renders
  const renderItem = ({ item }: { item: Job }) => (
    <View style={styles.cardWrapper}>
      <JobCard job={item} onApplyPress={handleApplyPress} />
      {/* Remove button sits beneath each card with a destructive tint */}
      <Pressable
        style={({ pressed }) => [
          styles.removeBtn,
          { borderColor: colors.destructive },
          pressed && { opacity: 0.6 },
        ]}
        onPress={() => handleRemoveJob(item)}
        android_ripple={{ color: colors.overlay }}
        accessibilityLabel={`Remove ${item.title} from saved jobs`}
        accessibilityRole="button"
      >
        <Text style={[styles.removeBtnText, { color: colors.destructive }]}>
          ✕ Remove
        </Text>
      </Pressable>
    </View>
  );

  // filter saved jobs using case‑insensitive substring match against title, company or location
  const filteredJobs = React.useMemo(() => {
    if (!searchQuery.trim()) return savedJobs;
    const lower = searchQuery.toLowerCase();
    return savedJobs.filter((j) => {
      // check title/companyName first
      if (j.title.toLowerCase().includes(lower)) return true;
      if (j.companyName?.toLowerCase().includes(lower)) return true;
      // locations is an array; look for any entry containing the query
      if (Array.isArray(j.locations)) {
        for (const loc of j.locations) {
          if (loc.toLowerCase().includes(lower)) return true;
        }
      }
      return false;
    });
  }, [savedJobs, searchQuery]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          // Respect the device notch / status bar height
          paddingTop: insets.top + (Platform.OS === "ios" ? 8 : 12),
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
        {/* ThemeToggle reads and writes to ThemeContext internally */}
        <ThemeToggle />
      </View>

      {/* ── Main content: either empty state or search + filtered list ── */}
      {savedJobs.length === 0 ? (
        <EmptyState
          title="Nothing saved yet"
          description="Tap the save button on any job listing to keep it here for later."
        />
      ) : (
        <>
          {/* search bar */}
          <View style={styles.searchWrapper}>
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search saved jobs..."
            />
          </View>

          <View
            style={[
              {
                // Use a subtle tinted background that adapts to the theme
                backgroundColor: isDark
                  ? colors.overlay
                  : (colors.primaryLight ?? colors.surface),
                borderColor: isDark ? colors.border : "transparent",
              },
            ]}
          >
             
          </View>
 {/* count line — plain Text, identical to JobFinder's resultCount */}
    <Text style={[styles.countText, { color: colors.textMuted }]}>
      {savedJobs.length} saved {savedJobs.length === 1 ? 'job' : 'jobs'}
    </Text>
          {/* filtered list or no matches */}
          {filteredJobs.length === 0 ? (
            <EmptyState
              title="No matches"
              description="Try another keyword to find a saved job."
            />
          ) : (
            <FlatList
              data={filteredJobs}
              keyExtractor={(item) => item.guid}
              renderItem={renderItem}
              contentContainerStyle={[
                styles.listContent,
                { paddingBottom: insets.bottom + 16 },
              ]}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                  tintColor={colors.primary}
                  colors={[colors.primary]}
                />
              }
            />
          )}
        </>
      )}

      {/* ── Removal confirmation modal ──────────────────────────── */}
      <ConfirmModal
        visible={confirmVisible}
        title="Remove saved job?"
        message={`Remove "${pendingRemove?.title ?? "this job"}" from your saved list?`}
        onConfirm={handleConfirmRemove}
        onCancel={() => {
          setPendingRemove(null);
          setConfirmVisible(false);
        }}
      />

      {/* ── Application form modal (slides up from bottom) ──────── */}
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

import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { useRoute, RouteProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import { useTheme } from '../hooks/useTheme';
import { Job } from '../types';
import { formatSalary } from '../utils/helpers';
import { useAppDispatch, useAppSelector } from '../store';
import { selectIsJobSaved, persistSaveJob, persistRemoveJob } from '../store/savedJobsSlice';
import { selectIsJobApplied } from '../store/appliedJobsSlice';
import ConfirmModal from '../components/ConfirmModal';
import ApplicationFormModal from '../components/ApplicationFormModal';
import { styles, sectionStyles } from './JobDetailScreen.styles';
import { useToast } from '../context/ToastContext';

type ParamList = {
  JobDetail: { job: Job };
};

const { width } = Dimensions.get('window');

// ── helper ──────────────────────────────────────────────────────────────────
const formatDate = (ts?: number) => {
  if (!ts) return null;
  return new Date(ts * 1000).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// ── sub-components ───────────────────────────────────────────────────────────
const SectionHeader: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <Text style={[sectionStyles.header, { color }]}>{label}</Text>
);

const Chip: React.FC<{ label: string; bg: string; text: string }> = ({ label, bg, text }) => (
  <View style={[sectionStyles.chip, { backgroundColor: bg }]}>
    <Text style={[sectionStyles.chipText, { color: text }]}>{label}</Text>
  </View>
);

const InfoRow: React.FC<{ icon: string; label: string; value: string; color: string; muted: string }> = ({
  icon, label, value, color, muted,
}) => (
  <View style={sectionStyles.infoRow}>
    <Text style={sectionStyles.infoIcon}>{icon}</Text>
    <View>
      <Text style={[sectionStyles.infoLabel, { color: muted }]}>{label}</Text>
      <Text style={[sectionStyles.infoValue, { color }]}>{value}</Text>
    </View>
  </View>
);

const Divider: React.FC<{ color: string }> = ({ color }) => (
  <View style={[sectionStyles.divider, { backgroundColor: color }]} />
);

// ── main screen ──────────────────────────────────────────────────────────────
const JobDetailScreen: React.FC = () => {
  const { params } = useRoute<RouteProp<ParamList, 'JobDetail'>>();
  const job = params.job;
  const { colors, isDark } = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const guid = job.guid ?? '';
  const isSaved = useAppSelector(selectIsJobSaved(guid));
  const isApplied = useAppSelector(selectIsJobApplied(guid));
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Show back button when screen is focused
  // when this screen becomes active we tweak the navigation header so it
  // appears over the job card (transparent background) and uses the theme's
  // primary color for the back button. We use useFocusEffect instead of
  // useEffect so the options are re-applied every time the user returns.
  // useFocusEffect re-applies header options every time the screen comes into
  // focus (e.g. after navigating back from a modal) so the transparent header
  // with primary-coloured back button is always correct
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerShown: true,
        headerTitle: '',
        headerTransparent: true,
        headerBackTitle: 'Back',
        headerTintColor: colors.primary,
        headerStyle: { backgroundColor: 'transparent' },
      });
    }, [navigation, colors.primary])
  );

  // useMemo prevents formatSalary from running on every render cycle;
  // only recalculated when the salary or currency values actually change
  const salaryLabel = useMemo(
    () => formatSalary(job.minSalary, job.maxSalary, job.currency),
    [job.minSalary, job.maxSalary, job.currency]
  );

  const handleSave = () => {
    if (!isSaved) {
      // persistSaveJob updates both Redux state and AsyncStorage atomically
      dispatch(persistSaveJob(job));
    } else {
      // Show a confirm modal before unsaving — avoids accidental data loss
      setConfirmVisible(true);
    }
  };

  const handleConfirmRemove = () => {
    dispatch(persistRemoveJob(guid));
    setConfirmVisible(false);
  };

  const handleApply = () => {
    if (isApplied) {
      // User has already applied — show informational toast instead of reopening form
      showToast('Already Applied', 'info');
    } else {
      setModalVisible(true);
    }
  };

  const pubDate = formatDate(job.pubDate);
  const expiryDate = formatDate(job.expiryDate);

  const htmlBaseStyle = useMemo(
    () => ({ color: colors.text, fontSize: 14, lineHeight: 22 }),
    [colors.text]
  );

  const htmlTagsStyles = useMemo(
    () => ({
      p: { marginTop: 0, marginBottom: 10 },
      ul: { paddingLeft: 16 },
      ol: { paddingLeft: 16 },
      li: { marginBottom: 4 },
      h1: { fontSize: 18, fontWeight: 700 as const, color: colors.text },
      h2: { fontSize: 16, fontWeight: 700 as const, color: colors.text },
      h3: { fontSize: 15, fontWeight: 600 as const, color: colors.text },
      strong: { color: colors.text },
      a: { color: colors.primary },
    }),
    [colors.text, colors.primary]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: Platform.OS === 'ios' ? 100 : 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero / Header ─────────────────────────────────────── */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.headerRow}>
            {job.companyLogo ? (
              <Image
                source={{ uri: job.companyLogo }}
                style={[styles.logo, { borderColor: colors.border }]}
                resizeMode="contain"
              />
            ) : (
              <View style={[styles.logoPlaceholder, { backgroundColor: colors.overlay, borderColor: colors.border }]}>
                <Text style={{ fontSize: 24 }}>🏢</Text>
              </View>
            )}
            <View style={styles.headerContent}>
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={3}>
                {job.title ?? 'Untitled Position'}
              </Text>
              <Text style={[styles.company, { color: colors.primary }]}>
                {job.companyName ?? 'Unknown Company'}
              </Text>
            </View>
          </View>

          {/* Chips row */}
          <View style={styles.chipsRow}>
            {job.jobType ? (
              // jobType always uses the themed chip style
              <Chip 
                label={job.jobType} 
                bg={isDark ? (colors.overlay || colors.border) : (colors.primaryLight || colors.surface)}
                text={isDark ? colors.text : colors.primary}
              />
            ) : null}
            {job.workModel ? (
              // workModel and seniorityLevel share same logic; dark mode uses
              // muted overlay and light mode uses primaryLight to keep contrast
              <Chip 
                label={job.workModel} 
                bg={isDark ? (colors.overlay || colors.border) : (colors.primaryLight || colors.surface)}
                text={isDark ? colors.text : colors.primary}
              />
            ) : null}
            {job.seniorityLevel ? (
              <Chip 
                label={job.seniorityLevel} 
                bg={isDark ? (colors.overlay || colors.border) : (colors.primaryLight || colors.surface)}
                text={isDark ? colors.text : colors.primary}
              />
            ) : null}
          </View>
        </View>

        {/* ── Key Details ───────────────────────────────────────── */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <SectionHeader label="Overview" color={colors.textMuted} />

          {salaryLabel ? (
            <InfoRow icon="💰" label="Salary" value={salaryLabel} color={colors.text} muted={colors.textMuted} />
          ) : null}

          {job.locations?.length ? (
            <InfoRow
              icon="📍"
              label="Location"
              value={job.locations?.join(' · ') ?? ''}
              color={colors.text}
              muted={colors.textMuted}
            />
          ) : null}

          {job.mainCategory ? (
            <InfoRow
              icon="🗂️"
              label="Category"
              value={job.mainCategory}
              color={colors.text}
              muted={colors.textMuted}
            />
          ) : null}

          {pubDate ? (
            <InfoRow icon="📅" label="Posted" value={pubDate} color={colors.text} muted={colors.textMuted} />
          ) : null}

          {expiryDate ? (
            <InfoRow icon="⏳" label="Apply by" value={expiryDate} color={colors.text} muted={colors.textMuted} />
          ) : null}
        </View>

        {/* ── Tags ─────────────────────────────────────────────── */}
        {job.tags?.length ? (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <SectionHeader label="Skills & Tags" color={colors.textMuted} />
            <View style={sectionStyles.tagsWrap}>
              {job.tags?.map((tag) => (
                <Chip 
                  key={tag} 
                  label={tag} 
                  bg={isDark ? (colors.overlay || colors.border) : (colors.primaryLight || colors.border)}
                  text={isDark ? colors.text : colors.primary}
                />
              ))}
            </View>
          </View>
        ) : null}

        {/* ── Description ──────────────────────────────────────── */}
        {job.description ? (
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <SectionHeader label="Job Description" color={colors.textMuted} />
            <Divider color={colors.border} />
            <RenderHTML
              contentWidth={width - 72}
              source={{ html: job.description }}
              baseStyle={htmlBaseStyle}
              tagsStyles={htmlTagsStyles}
            />
          </View>
        ) : null}

        {/* bottom spacer for footer */}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── Sticky Footer ─────────────────────────────────────── */}
      <View
        style={[
          styles.footer,
          { borderTopColor: colors.border, backgroundColor: colors.surface },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.saveBtn,
            { borderColor: isSaved ? colors.success ?? colors.primary : colors.border },
            pressed && { opacity: 0.7 },
          ]}
          onPress={handleSave}
          android_ripple={{ color: colors.overlay }}
          accessibilityLabel={isSaved ? 'Unsave job' : 'Save job'}
        >
          <Text
            style={[
              styles.btnText,
              { color: isSaved ? colors.success ?? colors.primary : colors.text },
            ]}
          >
            {isSaved ? '✓ Saved' : '♡  Save'}
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.applyBtn,
            { backgroundColor: isApplied ? colors.border : colors.primary },
            pressed && { opacity: 0.85 },
          ]}
          onPress={handleApply}
          android_ripple={{ color: colors.overlay }}
          accessibilityLabel={isApplied ? 'Already applied for job' : 'Apply for job'}
        >
          <Text style={[styles.btnText, { color: isApplied ? colors.textMuted : colors.onPrimary }]}>
            {isApplied ? '✓ Already Applied' : 'Apply Now →'}
          </Text>
        </Pressable>
      </View>

      <ConfirmModal
        visible={confirmVisible}
        title="Remove saved job?"
        message={`Remove "${job.title ?? 'this job'}" from your saved jobs?`}
        onConfirm={handleConfirmRemove}
        onCancel={() => setConfirmVisible(false)}
      />

      <ApplicationFormModal
        visible={modalVisible}
        job={job}
        onClose={() => setModalVisible(false)}
        onSuccess={() => {}}
        sourceScreen="JobDetail"
      />
    </View>
  );
};

export default JobDetailScreen;
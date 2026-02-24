import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
  StyleSheet,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { useRoute, RouteProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import { useTheme } from '../hooks/useTheme';
import { Job } from '../types';
import { formatSalary } from '../utils/helpers';
import { useAppDispatch, useAppSelector } from '../store';
import { selectIsJobSaved, persistSaveJob, persistRemoveJob } from '../store/savedJobsSlice';
import ConfirmModal from '../components/ConfirmModal';

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
  const { colors } = useTheme();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const guid = job.guid ?? '';
  const isSaved = useAppSelector(selectIsJobSaved(guid));
  const [confirmVisible, setConfirmVisible] = useState(false);

  // Show back button when screen is focused
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

  const salaryLabel = useMemo(
    () => formatSalary(job.minSalary, job.maxSalary, job.currency),
    [job.minSalary, job.maxSalary, job.currency]
  );

  const handleSave = () => {
    if (!isSaved) {
      dispatch(persistSaveJob(job));
    } else {
      setConfirmVisible(true);
    }
  };

  const handleConfirmRemove = () => {
    dispatch(persistRemoveJob(guid));
    setConfirmVisible(false);
  };

  const handleApply = async () => {
    const url = job.applicationLink;
    if (!url) {
      Alert.alert('No application link', 'This job does not have an external application link.');
      return;
    }
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Cannot open link', `Unable to open: ${url}`);
      }
    } catch {
      Alert.alert('Error', 'Something went wrong while opening the application link.');
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
      h1: { fontSize: 18, fontWeight: '700', color: colors.text },
      h2: { fontSize: 16, fontWeight: '700', color: colors.text },
      h3: { fontSize: 15, fontWeight: '600', color: colors.text },
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
              <Chip label={job.jobType} bg={colors.primaryLight ?? colors.overlay} text={colors.primary} />
            ) : null}
            {job.workModel ? (
              <Chip label={job.workModel} bg={colors.overlay} text={colors.textMuted} />
            ) : null}
            {job.seniorityLevel ? (
              <Chip label={job.seniorityLevel} bg={colors.overlay} text={colors.textMuted} />
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
            <View style={styles.tagsWrap}>
              {job.tags?.map((tag) => (
                <Chip key={tag} label={tag} bg={colors.overlay} text={colors.text} />
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
            { backgroundColor: colors.primary },
            pressed && { opacity: 0.85 },
            !job.applicationLink && { opacity: 0.5 },
          ]}
          onPress={handleApply}
          android_ripple={{ color: colors.overlay }}
          accessibilityLabel="Apply for job"
          disabled={false /* we show an alert if no link */}
        >
          <Text style={[styles.btnText, { color: colors.onPrimary }]}>Apply Now →</Text>
        </Pressable>
      </View>

      <ConfirmModal
        visible={confirmVisible}
        title="Remove saved job?"
        message={`Remove "${job.title ?? 'this job'}" from your saved jobs?`}
        onConfirm={handleConfirmRemove}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
  );
};

// ── styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },

  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },

  headerRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    marginRight: 12,
  },
  logoPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: { flex: 1 },
  title: { fontSize: 18, fontWeight: '700', lineHeight: 24, marginBottom: 4 },
  company: { fontSize: 14, fontWeight: '600' },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  saveBtn: {
    flex: 1,
    borderRadius: 50,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  applyBtn: {
    flex: 2,
    borderRadius: 50,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { fontSize: 14, fontWeight: '700' },
});

const sectionStyles = StyleSheet.create({
  header: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  divider: { height: StyleSheet.hairlineWidth, marginBottom: 12 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
    marginRight: 6,
    marginBottom: 6,
  },
  chipText: { fontSize: 12, fontWeight: '600' },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  infoIcon: { fontSize: 16, width: 24, marginTop: 1 },
  infoLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 1 },
  infoValue: { fontSize: 14, fontWeight: '500' },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap' },
});

export default JobDetailScreen;
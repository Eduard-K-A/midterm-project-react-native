import React, { useMemo, useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, Dimensions, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
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

const JobDetailScreen: React.FC = () => {
  const { params } = useRoute<RouteProp<ParamList, 'JobDetail'>>();
  const job = params.job;
  const { colors } = useTheme();
  const dispatch = useAppDispatch();
  const isSaved = useAppSelector(selectIsJobSaved(job.guid));

  const [confirmVisible, setConfirmVisible] = useState(false);

  const salaryLabel = useMemo(() => formatSalary(job.minSalary, job.maxSalary, job.currency), [job]);

  const handleSave = () => {
    if (!isSaved) {
      dispatch(persistSaveJob(job));
    } else {
      setConfirmVisible(true);
    }
  };

  const handleConfirmRemove = () => {
    dispatch(persistRemoveJob(job.guid));
    setConfirmVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerRow}>
          {job.companyLogo ? (
            <Image source={{ uri: job.companyLogo }} style={styles.logo} />
          ) : null}
          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: colors.text }]}>{job.title}</Text>
            <Text style={[styles.company, { color: colors.textMuted }]}>{job.companyName}</Text>
            <Text style={[styles.meta, { color: colors.textMuted }]}>{job.jobType} • {job.workModel} • {job.seniorityLevel}</Text>
          </View>
        </View>

        <View style={styles.chipsRow}>
          <Text style={[styles.salary, { color: colors.text }]}>{salaryLabel}</Text>
          <Text style={[styles.locations, { color: colors.textMuted }]}>{job.locations.join(', ')}</Text>
        </View>

        <View style={styles.description}>
          <RenderHTML contentWidth={width - 40} source={{ html: job.description }} baseStyle={{ color: colors.text }} />
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.surface }]}> 
        <Pressable style={[styles.saveBtn, { borderColor: colors.border }]} onPress={handleSave} android_ripple={{ color: colors.overlay }}>
          <Text style={{ color: isSaved ? colors.onSuccess : colors.text }}>{isSaved ? '✓ Saved' : 'Save'}</Text>
        </Pressable>
        <Pressable style={[styles.applyBtn, { backgroundColor: colors.primary }]} onPress={() => {}} android_ripple={{ color: colors.overlay }}>
          <Text style={{ color: colors.onPrimary }}>Apply</Text>
        </Pressable>
      </View>

      <ConfirmModal
        visible={confirmVisible}
        title="Remove this job from saved?"
        message={`Remove ${job.title} from saved jobs?`}
        onConfirm={handleConfirmRemove}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 120 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  logo: { width: 64, height: 64, borderRadius: 8, marginRight: 12 },
  headerContent: { flex: 1 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  company: { fontSize: 14, marginBottom: 6 },
  meta: { fontSize: 13 },
  chipsRow: { marginBottom: 12 },
  salary: { fontSize: 14, fontWeight: '600' },
  locations: { fontSize: 13, marginTop: 4 },
  description: { marginTop: 12 },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 12,
    flexDirection: 'row',
  },
  saveBtn: { flex: 1, borderRadius: 999, paddingVertical: 12, alignItems: 'center', justifyContent: 'center', marginRight: 8, borderWidth: 1 },
  applyBtn: { flex: 1, borderRadius: 999, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
});

export default JobDetailScreen;

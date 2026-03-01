import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JobsState, Job } from '../types';
import { fetchJobsFromApi } from '../api/jobsApi';

const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

const initialState: JobsState = {
  jobs: [],
  loading: false,
  error: null,
  searchQuery: '',
  lastFetchTime: null,
};

export const fetchJobs = createAsyncThunk<Job[], boolean | undefined>(
  'jobs/fetchJobs',
  async (forceRefresh = false) => {
    const jobs = await fetchJobsFromApi();
    return jobs;
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.loading = false;
        state.jobs = action.payload;
        state.lastFetchTime = Date.now();
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load jobs';
      });
  },
});

export const { setSearchQuery } = jobsSlice.actions;

export const selectJobsState = (state: { jobs: JobsState }): JobsState => state.jobs;

export const selectFilteredJobs = createSelector(
  [selectJobsState],
  (jobsState): Job[] => {
    const query = jobsState.searchQuery.trim().toLowerCase();

    if (!query) {
      return jobsState.jobs;
    }

    return jobsState.jobs.filter((job) => {
      const title = job.title.toLowerCase();
      const company = job.companyName.toLowerCase();
      const location = job.locations.join(' ').toLowerCase();
      return (
        title.includes(query) ||
        company.includes(query) ||
        location.includes(query)
      );
    });
  },
);

export const selectIsCacheValid = createSelector(
  [selectJobsState],
  (jobsState): boolean => {
    if (!jobsState.lastFetchTime) return false;
    return Date.now() - jobsState.lastFetchTime < CACHE_DURATION_MS;
  },
);

export default jobsSlice.reducer;


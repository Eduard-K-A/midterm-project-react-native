import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JobsState, Job } from '../types';
import { fetchJobsFromApi } from '../api/jobsApi';

const initialState: JobsState = {
  jobs: [],
  loading: false,
  error: null,
  searchQuery: '',
};

export const fetchJobs = createAsyncThunk<Job[]>('jobs/fetchJobs', async () => {
  const jobs = await fetchJobsFromApi();
  return jobs;
});

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

export default jobsSlice.reducer;


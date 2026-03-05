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

/**
 * Async thunk for fetching jobs from the remote API.
 *
 * `forceRefresh` is accepted as a parameter but the cache check is delegated
 * to the calling component (via `selectIsCacheValid`), which means the thunk
 * itself always hits the network when dispatched.
 */
export const fetchJobs = createAsyncThunk<Job[], boolean | undefined>(
  'jobs/fetchJobs',
  async (_forceRefresh = false) => {
    const jobs = await fetchJobsFromApi();
    return jobs;
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    /**
     * Stores the current search query in Redux so any connected component
     * can read the filtered list via `selectFilteredJobs` without prop drilling.
     */
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // While the request is in-flight — show loading indicators
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // On success — replace the entire job list and record the timestamp
      // for the cache validity check
      .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.loading = false;
        state.jobs = action.payload;
        state.lastFetchTime = Date.now();
      })
      // On failure — surface the error message for the UI error state
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load jobs';
      });
  },
});

export const { setSearchQuery } = jobsSlice.actions;

// ── Selectors ──────────────────────────────────────────────────────────────

export const selectJobsState = (state: { jobs: JobsState }): JobsState => state.jobs;

/**
 * Memoised selector that filters the full jobs array by the stored search
 * query. `createSelector` ensures this only re-computes when the input
 * selector result (`selectJobsState`) changes — not on every render.
 */
export const selectFilteredJobs = createSelector(
  [selectJobsState],
  (jobsState): Job[] => {
    const query = jobsState.searchQuery.trim().toLowerCase();

    // No query — return the full list without iteration
    if (!query) return jobsState.jobs;

    // Match against title, company name, or any of the job's location strings
    return jobsState.jobs.filter((job) => {
      const title    = job.title.toLowerCase();
      const company  = job.companyName.toLowerCase();
      const location = job.locations.join(' ').toLowerCase();
      return title.includes(query) || company.includes(query) || location.includes(query);
    });
  },
);

/**
 * Returns true if the last successful fetch was within CACHE_DURATION_MS.
 * Components use this to skip the `fetchJobs` dispatch on re-mount.
 */
export const selectIsCacheValid = createSelector(
  [selectJobsState],
  (jobsState): boolean => {
    if (!jobsState.lastFetchTime) return false;
    return Date.now() - jobsState.lastFetchTime < CACHE_DURATION_MS;
  },
);

export default jobsSlice.reducer;

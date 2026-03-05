import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Job, SavedJobsState } from '../types';

const initialState: SavedJobsState = {
  savedJobs: [],
};

const savedJobsSlice = createSlice({
  name: 'savedJobs',
  initialState,
  reducers: {
    /**
     * Adds a job to the in-memory saved list.
     * Duplicate-guard prevents a job being saved more than once if the
     * async thunk fires multiple times (e.g. rapid double-tap).
     */
    saveJob(state, action: PayloadAction<Job>) {
      const exists = state.savedJobs.some((job) => job.guid === action.payload.guid);
      if (!exists) {
        state.savedJobs.push(action.payload);
      }
    },
    /** Removes a job from the in-memory list by GUID. */
    removeJob(state, action: PayloadAction<string>) {
      state.savedJobs = state.savedJobs.filter((job) => job.guid !== action.payload);
    },
    /** Bulk-replaces the saved jobs list — used during hydration from AsyncStorage. */
    setSavedJobs(state, action: PayloadAction<Job[]>) {
      state.savedJobs = action.payload;
    },
  },
});

export const { saveJob, removeJob } = savedJobsSlice.actions;

// Each job is stored with its own key (prefix + guid) so individual entries
// can be added/removed atomically without re-serialising the whole array
const STORAGE_PREFIX = 'savedJob:';

/**
 * Saves a job to AsyncStorage AND dispatches the in-memory `saveJob` action.
 * Using an async thunk lets us do the storage write without blocking the UI.
 */
export const persistSaveJob = createAsyncThunk('savedJobs/persistSave', async (job: Job, thunkAPI) => {
  try {
    await AsyncStorage.setItem(`${STORAGE_PREFIX}${job.guid}`, JSON.stringify(job));
    thunkAPI.dispatch(saveJob(job));
  } catch {
    // Persistence errors are non-fatal — the job is still saved in memory
  }
});

/**
 * Removes a job from AsyncStorage AND dispatches the in-memory `removeJob` action.
 */
export const persistRemoveJob = createAsyncThunk('savedJobs/persistRemove', async (guid: string, thunkAPI) => {
  try {
    await AsyncStorage.removeItem(`${STORAGE_PREFIX}${guid}`);
    thunkAPI.dispatch(removeJob(guid));
  } catch {
    // Ignore — the in-memory state is already up to date
  }
});

/**
 * Reads all saved jobs from AsyncStorage on app startup.
 * Keys are filtered by the storage prefix to avoid touching unrelated entries.
 */
export const loadSavedJobs = createAsyncThunk('savedJobs/load', async (_, thunkAPI) => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const savedKeys = keys.filter((k) => k.startsWith(STORAGE_PREFIX));
    if (savedKeys.length === 0) return [] as Job[];

    // multiGet fetches all entries in a single read, more efficient than
    // iterating over keys one-by-one
    const pairs = await AsyncStorage.multiGet(savedKeys);
    const jobs: Job[] = pairs
      .map(([, value]) => {
        try {
          return value ? (JSON.parse(value) as Job) : null;
        } catch {
          // Corrupt entry — skip it
          return null;
        }
      })
      .filter((j): j is Job => j !== null);

    thunkAPI.dispatch(savedJobsSlice.actions.setSavedJobs(jobs));
    return jobs;
  } catch {
    return [] as Job[];
  }
});

// ── Selectors ──────────────────────────────────────────────────────────────

export const selectSavedJobsState = (state: { savedJobs: SavedJobsState }): SavedJobsState =>
  state.savedJobs;

export const selectSavedJobs = (state: { savedJobs: SavedJobsState }): Job[] =>
  state.savedJobs.savedJobs;

/**
 * Factory selector — returns a boolean selector for a specific job guid.
 * Using a factory pattern prevents creating a new selector reference on
 * every render, which would break referential equality in useAppSelector.
 */
export const selectIsJobSaved =
  (guid: string) =>
  (state: { savedJobs: SavedJobsState }): boolean =>
    state.savedJobs.savedJobs.some((job) => job.guid === guid);

export default savedJobsSlice.reducer;

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
    saveJob(state, action: PayloadAction<Job>) {
      const exists = state.savedJobs.some((job) => job.guid === action.payload.guid);
      if (!exists) {
        state.savedJobs.push(action.payload);
      }
    },
    removeJob(state, action: PayloadAction<string>) {
      state.savedJobs = state.savedJobs.filter((job) => job.guid !== action.payload);
    },
    setSavedJobs(state, action: PayloadAction<Job[]>) {
      state.savedJobs = action.payload;
    },
  },
});

export const { saveJob, removeJob } = savedJobsSlice.actions;

const STORAGE_PREFIX = 'savedJob:';

export const persistSaveJob = createAsyncThunk('savedJobs/persistSave', async (job: Job, thunkAPI) => {
  try {
    await AsyncStorage.setItem(`${STORAGE_PREFIX}${job.guid}`, JSON.stringify(job));
    thunkAPI.dispatch(saveJob(job));
  } catch {
    // ignore persistence errors for now
  }
});

export const persistRemoveJob = createAsyncThunk('savedJobs/persistRemove', async (guid: string, thunkAPI) => {
  try {
    await AsyncStorage.removeItem(`${STORAGE_PREFIX}${guid}`);
    thunkAPI.dispatch(removeJob(guid));
  } catch {
    // ignore
  }
});

export const loadSavedJobs = createAsyncThunk('savedJobs/load', async (_, thunkAPI) => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const savedKeys = keys.filter((k) => k.startsWith(STORAGE_PREFIX));
    if (savedKeys.length === 0) {
      return [] as Job[];
    }
    const pairs = await AsyncStorage.multiGet(savedKeys);
    const jobs: Job[] = pairs
      .map(([, value]) => {
        try {
          return value ? (JSON.parse(value) as Job) : null;
        } catch {
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

export const selectSavedJobsState = (state: { savedJobs: SavedJobsState }): SavedJobsState =>
  state.savedJobs;

export const selectSavedJobs = (state: { savedJobs: SavedJobsState }): Job[] =>
  state.savedJobs.savedJobs;

export const selectIsJobSaved =
  (guid: string) =>
  (state: { savedJobs: SavedJobsState }): boolean =>
    state.savedJobs.savedJobs.some((job) => job.guid === guid);

export default savedJobsSlice.reducer;


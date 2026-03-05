import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppliedJobsState {
  appliedGuids: string[];
}

const initialState: AppliedJobsState = {
  appliedGuids: [],
};

const appliedJobsSlice = createSlice({
  name: 'appliedJobs',
  initialState,
  reducers: {
    /**
     * Adds a GUID to the applied list if it isn't already present.
     * Storing only the GUID (not the full Job object) keeps the storage
     * footprint small — we only need to answer "has this job been applied to?"
     */
    markApplied(state, action: PayloadAction<string>) {
      if (!state.appliedGuids.includes(action.payload)) {
        state.appliedGuids.push(action.payload);
      }
    },
    /** Bulk-replaces the applied GUIDs — used during app-startup hydration. */
    setAppliedGuids(state, action: PayloadAction<string[]>) {
      state.appliedGuids = action.payload;
    },
  },
});

export const { markApplied, setAppliedGuids } = appliedJobsSlice.actions;

// All applied GUIDs are serialised into a single JSON array under one key,
// which is more efficient than one key-per-job for a read-only list
const STORAGE_KEY = 'appliedJobGuids';

/**
 * Marks a job as applied in Redux state AND persists the updated GUID list
 * to AsyncStorage so the applied state survives app restarts.
 */
export const persistMarkApplied = createAsyncThunk(
  'appliedJobs/persistMark',
  async (guid: string, thunkAPI) => {
    // Dispatch first so the UI updates immediately without waiting for storage
    thunkAPI.dispatch(markApplied(guid));
    try {
      // Read current state AFTER dispatch so the new guid is included
      const state = thunkAPI.getState() as { appliedJobs: AppliedJobsState };
      const updated = [...state.appliedJobs.appliedGuids];
      if (!updated.includes(guid)) updated.push(guid);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Storage write failure is non-fatal; state is already updated in memory
    }
  }
);

/**
 * Reads persisted applied GUIDs from AsyncStorage on app startup and
 * populates the Redux slice so all screens reflect the correct state.
 */
export const loadAppliedJobs = createAsyncThunk(
  'appliedJobs/load',
  async (_, thunkAPI) => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const guids: string[] = JSON.parse(raw);
        thunkAPI.dispatch(setAppliedGuids(guids));
      }
    } catch {
      // Ignore parse/read errors — start fresh with an empty list
    }
  }
);

/**
 * Factory selector — creates a per-guid selector instance.
 * This pattern avoids returning a new function reference on each render,
 * which would cause useAppSelector to re-subscribe unnecessarily.
 */
export const selectIsJobApplied =
  (guid: string) =>
  (state: { appliedJobs: AppliedJobsState }): boolean =>
    state.appliedJobs.appliedGuids.includes(guid);

export default appliedJobsSlice.reducer;

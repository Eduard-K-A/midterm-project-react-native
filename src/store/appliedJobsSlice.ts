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
    markApplied(state, action: PayloadAction<string>) {
      if (!state.appliedGuids.includes(action.payload)) {
        state.appliedGuids.push(action.payload);
      }
    },
    setAppliedGuids(state, action: PayloadAction<string[]>) {
      state.appliedGuids = action.payload;
    },
  },
});

export const { markApplied, setAppliedGuids } = appliedJobsSlice.actions;

const STORAGE_KEY = 'appliedJobGuids';

export const persistMarkApplied = createAsyncThunk(
  'appliedJobs/persistMark',
  async (guid: string, thunkAPI) => {
    thunkAPI.dispatch(markApplied(guid));
    try {
      const state = thunkAPI.getState() as { appliedJobs: AppliedJobsState };
      const updated = [...state.appliedJobs.appliedGuids];
      if (!updated.includes(guid)) updated.push(guid);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore persistence errors
    }
  }
);

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
      // ignore
    }
  }
);

export const selectIsJobApplied =
  (guid: string) =>
  (state: { appliedJobs: AppliedJobsState }): boolean =>
    state.appliedJobs.appliedGuids.includes(guid);

export default appliedJobsSlice.reducer;

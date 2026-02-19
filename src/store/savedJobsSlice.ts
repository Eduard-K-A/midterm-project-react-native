import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Job, SavedJobsState } from '../types';

const initialState: SavedJobsState = {
  savedJobs: [],
};

const savedJobsSlice = createSlice({
  name: 'savedJobs',
  initialState,
  reducers: {
    saveJob(state, action: PayloadAction<Job>) {
      const exists = state.savedJobs.some((job) => job.id === action.payload.id);
      if (!exists) {
        state.savedJobs.push(action.payload);
      }
    },
    removeJob(state, action: PayloadAction<string>) {
      state.savedJobs = state.savedJobs.filter((job) => job.id !== action.payload);
    },
  },
});

export const { saveJob, removeJob } = savedJobsSlice.actions;

export const selectSavedJobsState = (state: { savedJobs: SavedJobsState }): SavedJobsState =>
  state.savedJobs;

export const selectSavedJobs = (state: { savedJobs: SavedJobsState }): Job[] =>
  state.savedJobs.savedJobs;

export const selectIsJobSaved =
  (id: string) =>
  (state: { savedJobs: SavedJobsState }): boolean =>
    state.savedJobs.savedJobs.some((job) => job.id === id);

export default savedJobsSlice.reducer;


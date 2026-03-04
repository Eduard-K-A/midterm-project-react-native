import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import jobsReducer from './jobsSlice';
import savedJobsReducer from './savedJobsSlice';
import appliedJobsReducer from './appliedJobsSlice';

export const store = configureStore({
  reducer: {
    jobs: jobsReducer,
    savedJobs: savedJobsReducer,
    appliedJobs: appliedJobsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


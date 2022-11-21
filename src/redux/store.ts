import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import userSlice from './userSlice';

export const store = configureStore({
  reducer: {
    app: authSlice.reducer,
    user: userSlice.reducer,
  },
});
export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

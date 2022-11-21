import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import appSlice from 'redux/authSlice';
import userSlice from './userSlice';

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
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

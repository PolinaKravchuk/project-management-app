import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import appSlice from 'redux/appSlice';

export const store = configureStore({
  reducer: appSlice.reducer,
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

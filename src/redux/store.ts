import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import appSlice from './appSlice';
import authSlice from './authSlice';
import boardSlice from './boardSlice';
import mainSlice from './mainSlice';
import userSlice from './userSlice';

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    auth: authSlice.reducer,
    user: userSlice.reducer,
    main: mainSlice,
    board: boardSlice,
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

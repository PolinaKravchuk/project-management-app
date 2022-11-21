import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import Constants from 'utils/Constants';
import UserState from 'types/UserState';

const initialState: UserState = {
  data: {},
  inProgress: false,
  userId: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    loginUser: (state, action) => {
      state.userId = action.payload._id;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.data = action.payload;
      state.inProgress = false;
    });
    builder.addCase(fetchUser.pending, (state) => {
      state.inProgress = true;
    });
    builder.addCase(fetchUser.rejected, (state) => {
      state.inProgress = false;
    });
  },
});

export default userSlice;

export const fetchUser = createAsyncThunk('user/fetchUser', async (userId: string) => {
  const res = await axios.get(`${Constants.APP_URL} + 'users/' + ${userId}`).then(() => {});
  return res;
});

export const { loginUser } = userSlice.actions;

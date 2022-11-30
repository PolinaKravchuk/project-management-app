import axios from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import UserState from 'types/UserState';
import { UserParams } from 'types/UserData';
import Constants from 'utils/Constants';

const initialState: UserState = {
  inProgress: false,
  id: '',
  name: '',
  password: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.id = action.payload.id;
    },
    setUserData: (state, action) => {
      state.name = action.payload.name;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.fulfilled, (state, action) => {
        state.name = action.payload.name;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.name = action.payload.name;
      });
  },
});

export default userSlice;

export const getUser = createAsyncThunk('user/getUser', async (params: UserParams) => {
  const res = await axios.get(`${Constants.APP_URL}users/${params.id}`, {
    headers: getHeaders(params),
  });
  return res.data;
});

export const updateUser = createAsyncThunk('user/updateUser', async (params: UserParams) => {
  const payload = params.payload;
  const res = await axios.put(`${Constants.APP_URL}users/${params.id}`, payload, {
    headers: getHeaders(params),
  });
  return res.data;
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (params: UserParams) => {
  const res = await axios.delete(`${Constants.APP_URL}users/${params.id}`, {
    headers: getHeaders(params),
  });
  return res.data;
});
export const { loginUser, setUserData } = userSlice.actions;

function getHeaders(params: UserParams) {
  return {
    Accept: 'application/json',
    Authorization: 'Bearer ' + params.token,
  };
}

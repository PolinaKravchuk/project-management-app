import { createSlice } from '@reduxjs/toolkit';
import AuthState from 'types/AuthState';

const initialState: AuthState = {
  isLogged: false,
  token: localStorage.getItem('token') || '',
  login: '',
  password: '',
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.isLogged = true;
      state.token = action.payload.token;
      state.login = action.payload.login;
      state.password = action.payload.password;

      localStorage.setItem('token', action.payload.token);
    },
    updateLogin: (state, action) => {
      state.login = action.payload.login;
    },
    logoutUser: (state) => {
      state.isLogged = false;
      state.token = '';
      state.login = '';
      state.password = '';

      localStorage.setItem('token', '');
    },
  },
});

export const { setCredentials, updateLogin, logoutUser } = authSlice.actions;
export default authSlice;

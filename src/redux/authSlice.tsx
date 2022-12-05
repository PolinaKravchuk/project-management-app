import { createSlice } from '@reduxjs/toolkit';
import AuthState from 'types/AuthState';
import secureLocalStorage from 'react-secure-storage';

const initialState: AuthState = {
  token: localStorage.getItem('token') || '',
  login: '',
  password: '',
};
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.login = action.payload.login;
      state.password = action.payload.password;

      localStorage.setItem('token', action.payload.token);
      secureLocalStorage.setItem('userPassword', action.payload.password);
    },
    updateLogin: (state, action) => {
      state.login = action.payload.login;
    },
    updatePassword: (state) => {
      state.password = secureLocalStorage.getItem('userPassword') as string;
    },
    logoutUser: (state) => {
      state.token = '';
      state.login = '';
      state.password = '';

      localStorage.setItem('token', '');
      localStorage.setItem('userId', '');
    },
  },
});

export const { setCredentials, updateLogin, updatePassword, logoutUser } = authSlice.actions;
export default authSlice;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogged: false,
};
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.isLogged = true;
    },
  },
});

export default appSlice;

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Constants from 'utils/Constants';

const initialState = {};
const boardSlice = createSlice({
  name: 'boardDetails',
  initialState,
  reducers: {},
});

const fetchColumns = createAsyncThunk('boardDetails/fetchColumns', async (boardId: string) => {
  const res = await axios.get(`${Constants.APP_URL}boards/${boardId}`);
});

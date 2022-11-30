import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { BoardState, Column, ColumnParams } from 'types/BoardState';
import Constants from 'utils/Constants';
import { isError } from './mainSlice';

const initialState: BoardState = {
  error: '',
  order: 0,
  columns: [],
};
const boardSlice = createSlice({
  name: 'boardDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddColumn.pending, (state) => {
        state.error = '';
      })
      .addCase(fetchAddColumn.fulfilled, (state, action) => {
        state.columns.push(action.payload);
        state.order = action.payload.order + 1;
      })
      .addCase(fetchGetColumns.pending, (state) => {
        state.error = '';
      })
      .addCase(fetchGetColumns.fulfilled, (state, action) => {
        state.columns = action.payload;
      })
      .addCase(fetchRemoveColumn.pending, (state) => {
        state.error = '';
      })
      .addCase(fetchRemoveColumn.fulfilled, (state, action) => {
        state.columns = state.columns.filter((column) => column._id !== action.payload._id);
      })
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        state.error = action.payload;
      });
  },
});

export default boardSlice.reducer;

export const fetchColumns = createAsyncThunk(
  'boardDetails/fetchColumns',
  async (boardId: string) => {
    const res = await axios.get(`${Constants.APP_URL}boards/${boardId}`);
  }
);

export const fetchAddColumn = createAsyncThunk<Column, ColumnParams, { rejectValue: string }>(
  'addColumn/fetch',
  async (params, { rejectWithValue }) => {
    const response = await fetch(`${Constants.APP_URL}boards/${params._id}/columns`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${params.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params.columnBody),
    });

    if (!response.ok) {
      return rejectWithValue('board.boardErrorMessage.addColumn');
    }
    const data: Column = await response.json();

    return data;
  }
);
export const fetchGetColumns = createAsyncThunk<
  Column[],
  { _id: string; token: string },
  { rejectValue: string }
>('getColumn/fetch', async (params, { rejectWithValue }) => {
  const response = await fetch(`${Constants.APP_URL}boards/${params._id}/columns`, {
    headers: {
      Authorization: `Bearer ${params.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    return rejectWithValue('board.boardErrorMessage.getColumn');
  }
  const data: Column[] = await response.json();

  return data;
});

export const fetchRemoveColumn = createAsyncThunk<Column, ColumnParams, { rejectValue: string }>(
  'removeColumn/fetch',
  async (params, { rejectWithValue }) => {
    const response = await fetch(
      `${Constants.APP_URL}boards/${params.boardId}/columns/${params._id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${params.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return rejectWithValue('board.boardErrorMessage.removeColumn');
    }
    const data: Column = await response.json();

    return data;
  }
);

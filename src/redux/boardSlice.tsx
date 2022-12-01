import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { BoardState, TColumn, ColumnParams } from 'types/BoardState';
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
  reducers: {
    updateColumns: (state, action) => {
      state.columns = action.payload;
    },
  },
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

export const { updateColumns } = boardSlice.actions;
export default boardSlice.reducer;

export const fetchAddColumn = createAsyncThunk<TColumn, ColumnParams, { rejectValue: string }>(
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
    const data: TColumn = await response.json();

    return data;
  }
);
export const fetchGetColumns = createAsyncThunk<
  TColumn[],
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
  const data: TColumn[] = await response.json();

  return data;
});

export const fetchRemoveColumn = createAsyncThunk<TColumn, ColumnParams, { rejectValue: string }>(
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
    const data: TColumn = await response.json();

    return data;
  }
);

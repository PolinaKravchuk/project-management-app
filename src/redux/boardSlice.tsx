import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { BoardState, IColumn, ColumnParams, TaskParams, TaskBody } from 'types/BoardState';
import Constants from 'utils/Constants';
import { isError } from './mainSlice';

const initialState: BoardState = {
  isColumnModal: false,
  columnId: '',
  isTaskModal: false,
  error: '',
  orderColumn: 0,
  orderTask: 0,
  columns: [],
  tasks: [],
};
const boardSlice = createSlice({
  name: 'boardDetails',
  initialState,
  reducers: {
    openColumnModal(state) {
      state.isColumnModal = true;
    },
    closeColumnModal(state) {
      state.isColumnModal = false;
    },
    openTaskModal(state, action: PayloadAction<string>) {
      state.isTaskModal = true;
      state.columnId = action.payload;
    },
    closeTaskModal(state) {
      state.isTaskModal = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddColumn.pending, (state) => {
        state.error = '';
      })
      .addCase(fetchAddColumn.fulfilled, (state, action) => {
        state.columns.push(action.payload);
        state.orderColumn = action.payload.order + 1;
      })
      .addCase(fetchGetColumns.pending, (state) => {
        state.error = '';
        state.columns = [];
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
      .addCase(fetchAddTask.pending, (state) => {
        state.error = '';
      })
      .addCase(fetchAddTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        state.orderTask = action.payload.order + 1;
      })
      .addCase(fetchGetTasks.pending, (state) => {
        state.error = '';
        state.tasks = [];
      })
      .addCase(fetchGetTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(fetchRemoveTask.pending, (state) => {
        state.error = '';
      })
      .addCase(fetchRemoveTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload._id);
      })
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        state.error = action.payload;
      });
  },
});

export const { openColumnModal, closeColumnModal, openTaskModal, closeTaskModal } =
  boardSlice.actions;
export default boardSlice.reducer;

export const fetchColumns = createAsyncThunk(
  'boardDetails/fetchColumns',
  async (boardId: string) => {
    const res = await axios.get(`${Constants.APP_URL}boards/${boardId}`);
  }
);

export const fetchAddColumn = createAsyncThunk<IColumn, ColumnParams, { rejectValue: string }>(
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
    const data: IColumn = await response.json();

    return data;
  }
);
export const fetchGetColumns = createAsyncThunk<
  IColumn[],
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
  const data: IColumn[] = await response.json();

  return data;
});

export const fetchRemoveColumn = createAsyncThunk<IColumn, ColumnParams, { rejectValue: string }>(
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
    const data: IColumn = await response.json();

    return data;
  }
);

export const fetchAddTask = createAsyncThunk<TaskBody, TaskParams, { rejectValue: string }>(
  'addTask/fetch',
  async (params, { rejectWithValue }) => {
    const response = await fetch(
      `${Constants.APP_URL}boards/${params._id}/columns/${params.columnId}/tasks`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${params.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params.taskBody),
      }
    );

    if (!response.ok) {
      return rejectWithValue('task.taskErrorMessage.addTask');
    }
    const data: TaskBody = await response.json();

    return data;
  }
);

export const fetchGetTasks = createAsyncThunk<TaskBody[], TaskParams, { rejectValue: string }>(
  'getTasks/fetch',
  async (params, { rejectWithValue }) => {
    const response = await fetch(`${Constants.APP_URL}tasksSet/${params._id}`, {
      headers: {
        Authorization: `Bearer ${params.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return rejectWithValue('task.taskErrorMessage.getTask');
    }
    const data: TaskBody[] = await response.json();

    return data;
  }
);

export const fetchRemoveTask = createAsyncThunk<TaskBody, TaskParams, { rejectValue: string }>(
  'removeTask/fetch',
  async (params, { rejectWithValue }) => {
    const response = await fetch(
      `${Constants.APP_URL}boards/${params.boardId}/columns/${params.columnId}/tasks/${params._id}`,
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
      return rejectWithValue('task.taskErrorMessage.removeTask');
    }
    const data: TaskBody = await response.json();

    return data;
  }
);

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { ITask } from 'components/Task/types';
import {
  BoardState,
  IColumn,
  ColumnParams,
  TaskParams,
  TaskBody,
  TaskBodyUpdate,
  TaskBodyUpdateParams,
} from 'types/BoardState';
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
      .addCase(updateColumnOrder.fulfilled, (state, action) => {
        state.columns
          .filter((column) => column._id === action.payload._id)
          .forEach((column) => (column.order = action.payload.order));
        sortItems(state.columns);
      })
      .addCase(fetchGetColumns.pending, (state) => {
        state.error = '';
        state.columns = [];
      })
      .addCase(fetchGetColumns.fulfilled, (state, action) => {
        state.columns = sortItems(action.payload) as IColumn[];
      })
      .addCase(fetchUpdateColumnTitle.pending, (state) => {
        state.error = '';
      })
      .addCase(fetchUpdateColumnTitle.fulfilled, (state, action) => {
        const columnIndex = state.columns.findIndex((column) => column._id === action.payload._id);
        state.columns[columnIndex] = action.payload;
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
      .addCase(updateTaskOrder.fulfilled, (state, action) => {
        state.tasks
          .filter((task) => task._id === action.payload._id)
          .forEach((task) => (task.order = action.payload.order));
        sortItems(state.tasks);
      })
      .addCase(fetchGetTasks.pending, (state) => {
        state.error = '';
        state.tasks = [];
      })
      .addCase(fetchGetTasks.fulfilled, (state, action) => {
        state.tasks = sortItems(action.payload) as TaskBody[];
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

function sortItems(items: IColumn[] | TaskBody[]) {
  return items.sort((a: IColumn | TaskBody, b: IColumn | TaskBody) => {
    return a.order - b.order;
  });
}

export const { openColumnModal, closeColumnModal, openTaskModal, closeTaskModal } =
  boardSlice.actions;
export default boardSlice.reducer;

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
export const updateColumnOrder = createAsyncThunk<IColumn, ColumnParams, { rejectValue: string }>(
  'updateColumnOrder/fetch',
  async (params, { rejectWithValue }) => {
    const response = await fetch(
      `${Constants.APP_URL}boards/${params.boardId}/columns/${params._id}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${params.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params.columnBody),
      }
    );

    if (!response.ok) {
      return rejectWithValue('board.boardErrorMessage.updateOrder');
    }
    const data: IColumn = await response.json();

    return data;
  }
);
export const fetchUpdateColumnTitle = createAsyncThunk<
  IColumn,
  ColumnParams,
  { rejectValue: string }
>('updateColumnTitle/fetch', async (params, { rejectWithValue }) => {
  const response = await fetch(
    `${Constants.APP_URL}boards/${params.boardId}/columns/${params._id}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${params.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params.columnBody),
    }
  );

  if (!response.ok) {
    return rejectWithValue('board.boardErrorMessage.updateOrder');
  }
  const data: IColumn = await response.json();

  return data;
});
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

export const updateTaskOrder = createAsyncThunk<
  TaskBodyUpdate,
  TaskBodyUpdateParams,
  { rejectValue: string }
>('updateTaskOrder/fetch', async (params, { rejectWithValue }) => {
  const task = params.taskBody;
  const response = await fetch(
    `${Constants.APP_URL}boards/${params.boardId}/columns/${task.columnId}/tasks/${params._id}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${params.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params.taskBody),
    }
  );

  if (!response.ok) {
    return rejectWithValue('board.boardErrorMessage.updateTask');
  }
  const data: TaskBodyUpdate = await response.json();

  return data;
});

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

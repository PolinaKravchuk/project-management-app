import { AnyAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Board, MainParams, MainRemoveParams, MainState } from 'types/MainState';
import Constants from 'utils/Constants';

const initialState: MainState = {
  isModal: false,
  isConfirmModal: false,
  isPending: false,
  currentBoardRemoveId: '',
  error: '',
  boards: [],
};

export const mainReducer = createSlice({
  name: 'main',
  initialState,
  reducers: {
    openModal(state) {
      state.isModal = true;
    },
    closeModal(state) {
      state.isModal = false;
      state.isConfirmModal = false;
    },
    confirmModalText(state) {
      state.isConfirmModal = true;
    },
    saveCurrentBoardRemove(state, action: PayloadAction<string>) {
      state.currentBoardRemoveId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddBoard.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchAddBoard.fulfilled, (state, action) => {
        state.isPending = false;
        const { title, description } = JSON.parse(action.payload.title);
        const addBoard: Board = { ...action.payload, title, description };
        state.boards.push(addBoard);
      })
      .addCase(fetchGetBoards.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchGetBoards.fulfilled, (state, action) => {
        state.isPending = false;
        state.boards = action.payload;
      })
      .addCase(fetchRemoveBoard.pending, (state) => {
        state.isPending = true;
      })
      .addCase(fetchRemoveBoard.fulfilled, (state, action) => {
        state.isPending = false;
        state.boards = state.boards.filter((board) => board._id !== action.payload._id);
      })
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
        state.isPending = false;
        state.error = action.payload;
      });
  },
});

function isError(action: AnyAction) {
  return action.type.endsWith('rejected');
}

export const { openModal, closeModal, confirmModalText, saveCurrentBoardRemove } =
  mainReducer.actions;
export default mainReducer.reducer;

export const fetchAddBoard = createAsyncThunk<Board, MainParams, { rejectValue: string }>(
  'addBoard/fetch',
  async (params, { rejectWithValue }) => {
    const response = await fetch(Constants.APP_URL + 'boards', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${params.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params.boardBody),
    });

    if (!response.ok) {
      return rejectWithValue('Не удалось создать доску!');
    }
    const data: Board = await response.json();

    return data;
  }
);
export const fetchGetBoards = createAsyncThunk<Board[], string, { rejectValue: string }>(
  'getBoard/fetch',
  async (token, { rejectWithValue }) => {
    const response = await fetch(Constants.APP_URL + 'boards', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    if (!response.ok) {
      return rejectWithValue('Не удалось загрузить доски!');
    }
    const data = await response.json();
    const boards: Board[] = data.map((board: Board) => {
      const { title, description } = JSON.parse(board.title);
      board = { ...board, title, description };
      return board;
    });
    return boards;
  }
);

export const fetchRemoveBoard = createAsyncThunk<Board, MainRemoveParams, { rejectValue: string }>(
  'removeBoard/fetch',
  async ({ token, currentBoardRemoveId }, { rejectWithValue }) => {
    const response = await fetch(`${Constants.APP_URL}boards/${currentBoardRemoveId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return rejectWithValue('Не удалось удалить доску!');
    }
    const data: Board = await response.json();
    return data;
  }
);

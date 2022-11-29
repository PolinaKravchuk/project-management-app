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
        state.error = '';
      })
      .addCase(fetchAddBoard.fulfilled, (state, action) => {
        const { title, description } = JSON.parse(action.payload.title);
        const addBoard: Board = { ...action.payload, title, description };
        state.boards.push(addBoard);
      })
      .addCase(fetchGetBoards.pending, (state) => {
        state.error = '';
      })
      .addCase(fetchGetBoards.fulfilled, (state, action) => {
        state.boards = action.payload;
      })
      .addCase(fetchRemoveBoard.pending, (state) => {
        state.error = '';
      })
      .addCase(fetchRemoveBoard.fulfilled, (state, action) => {
        state.boards = state.boards.filter((board) => board._id !== action.payload._id);
      })
      .addMatcher(isError, (state, action: PayloadAction<string>) => {
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
      return rejectWithValue('main.mainErrorMessage.addBoard');
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
      return rejectWithValue('main.mainErrorMessage.getBoard');
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
  async ({ token, id }, { rejectWithValue }) => {
    const response = await fetch(`${Constants.APP_URL}boards/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return rejectWithValue('main.mainErrorMessage.removeBoard');
    }
    const data: Board = await response.json();
    return data;
  }
);

export interface Board {
  _id?: string;
  title: string;
  description?: string;
  owner: string;
  users: string[];
}

export interface MainState {
  isModal: boolean;
  isConfirmModal: boolean;
  isPending: boolean;
  currentBoardRemoveId: string;
  error: string;
  boards: Board[];
}

export interface MainParams {
  token: string;
  boardBody: Board;
}
export interface MainRemoveParams {
  token: string;
  currentBoardRemoveId: string;
}

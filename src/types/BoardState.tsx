export interface IColumn {
  _id: string;
  title: string;
  order: number;
  boardId: string;
}
export interface BoardState {
  isColumnModal: boolean;
  columnId: string;
  isTaskModal: boolean;
  error: string;
  orderColumn: number;
  orderTask: number;
  columns: IColumn[];
  tasks: TaskBody[];
}
export interface ColumnParams {
  _id: string;
  token: string;
  columnBody?: { title: string; order: number };
  boardId?: string;
}
export interface TaskBody {
  _id?: string;
  title: string;
  order: number;
  boardId?: string;
  columnId?: string;
  description: string;
  userId: number | string;
  users: string[];
}
export interface TaskParams {
  _id: string;
  token: string;
  taskBody?: TaskBody;
  boardId?: string;
  columnId?: string;
  taskId?: string;
}

export interface TaskBodyUpdate {
  title: string;
  order: number;
  columnId: string;
  description: string;
  userId: number | string;
  users: string[];
}
export interface TaskBodyUpdateParams {
  _id: string;
  token: string;
  taskBody: TaskBodyUpdate;
  boardId: string;
}

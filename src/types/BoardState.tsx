export interface IColumn {
  _id: string;
  title: string;
  order: number;
  boardId: string;
}
export interface OrderColumn {
  [index: string]: number;
}
export interface BoardState {
  isColumnModal: boolean;
  columnId: string;
  isTaskModal: boolean;
  error: string;
  orderColumn: OrderColumn;
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

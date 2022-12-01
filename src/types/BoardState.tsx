export interface TColumn {
  _id: string;
  title: string;
  order: number;
  boardId: string;
}
export interface BoardState {
  error: string;
  order: number;
  columns: TColumn[];
}
export interface ColumnParams {
  _id: string;
  token: string;
  columnBody?: { title: string; order: number };
  boardId?: string;
}

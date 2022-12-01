export interface IColumn {
  column: { _id: string; title: string; order: number; boardId: string };
  index: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  onClick: (e: React.MouseEvent) => void;
}

export interface IDragItem {
  index: number;
  id: string;
  type: string;
}

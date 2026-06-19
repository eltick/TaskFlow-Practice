import type { BoardColumn } from "./types";

export const defaultColumns: BoardColumn[] = [
  { id: "todo", title: "К выполнению" },
  { id: "in_progress", title: "В работе" },
  { id: "done", title: "Готово" },
];

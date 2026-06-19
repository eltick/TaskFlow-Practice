import type { FormEvent } from "react";
import type { BoardColumn } from "../../../entities/column/model/types";
import type { TaskDraft } from "../../../entities/task/model/types";
import { ColumnForm } from "../../../features/column-create/ui/ColumnForm";
import { TaskForm } from "../../../features/task-create/ui/TaskForm";

interface TaskSidebarProps {
  columns: BoardColumn[];
  draft: TaskDraft;
  error: string;
  columnTitle: string;
  onDraftChange: (draft: TaskDraft) => void;
  onColumnTitleChange: (title: string) => void;
  onSubmitTask: (event: FormEvent<HTMLFormElement>) => void;
  onSubmitColumn: (event: FormEvent<HTMLFormElement>) => void;
}

export function TaskSidebar({
  columns,
  draft,
  error,
  columnTitle,
  onDraftChange,
  onColumnTitleChange,
  onSubmitTask,
  onSubmitColumn,
}: TaskSidebarProps) {
  return (
    <aside className="sidebar">
      <TaskForm columns={columns} draft={draft} error={error} onDraftChange={onDraftChange} onSubmit={onSubmitTask} />
      <ColumnForm title={columnTitle} onChange={onColumnTitleChange} onSubmit={onSubmitColumn} />
    </aside>
  );
}

import { FormEvent } from "react";
import type { BoardColumn } from "../../../entities/column/model/types";
import { priorityLabels } from "../../../entities/task/model/constants";
import type { TaskDraft, TaskPriority } from "../../../entities/task/model/types";

interface TaskFormProps {
  columns: BoardColumn[];
  draft: TaskDraft;
  error: string;
  onDraftChange: (draft: TaskDraft) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function TaskForm({ columns, draft, error, onDraftChange, onSubmit }: TaskFormProps) {
  return (
    <form className="task-form" onSubmit={onSubmit}>
      <h2>Новая задача</h2>
      <label>
        Название
        <input
          value={draft.title}
          onChange={(event) => onDraftChange({ ...draft, title: event.target.value })}
          placeholder="Например: оформить отчет"
        />
      </label>
      <label>
        Описание
        <textarea
          value={draft.description}
          onChange={(event) => onDraftChange({ ...draft, description: event.target.value })}
          placeholder="Подробности задачи"
        />
      </label>
      <div className="form-row">
        <label>
          Колонка
          <select value={draft.status} onChange={(event) => onDraftChange({ ...draft, status: event.target.value })}>
            {columns.map((column) => (
              <option key={column.id} value={column.id}>
                {column.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Приоритет
          <select
            value={draft.priority}
            onChange={(event) => onDraftChange({ ...draft, priority: event.target.value as TaskPriority })}
          >
            {Object.entries(priorityLabels).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="form-row">
        <label>
          Срок
          <input
            type="date"
            value={draft.dueDate}
            onChange={(event) => onDraftChange({ ...draft, dueDate: event.target.value })}
          />
        </label>
        <label>
          Теги
          <input
            value={draft.tags}
            onChange={(event) => onDraftChange({ ...draft, tags: event.target.value })}
            placeholder="учеба, отчет"
          />
        </label>
      </div>
      {error && <p className="form-error">{error}</p>}
      <button type="submit">Добавить задачу</button>
    </form>
  );
}

import type { BoardColumn } from "../../column/model/types";
import { priorityLabels } from "../model/constants";
import type { Task } from "../model/types";

interface TaskModalProps {
  columns: BoardColumn[];
  task: Task | null;
  onClose: () => void;
}

export function TaskModal({ columns, task, onClose }: TaskModalProps) {
  if (!task) return null;

  const column = columns.find((item) => item.id === task.status);

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section className="task-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Закрыть">
          x
        </button>
        <p className="eyebrow">{column?.title ?? "Задача"}</p>
        <h2>{task.title}</h2>
        <p className="modal-description">{task.description || "Описание пока не добавлено."}</p>
        <div className="task-meta">
          <span>{priorityLabels[task.priority]}</span>
          <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString("ru-RU") : "Без срока"}</span>
        </div>
        {task.tags.length > 0 && (
          <div className="tags">
            {task.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

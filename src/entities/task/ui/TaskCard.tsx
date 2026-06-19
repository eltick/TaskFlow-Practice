import { priorityLabels } from "../model/constants";
import type { Task } from "../model/types";

interface TaskCardProps {
  task: Task;
  onOpen: (task: Task) => void;
  onRemove: (task: Task) => void;
}

export function TaskCard({ task, onOpen, onRemove }: TaskCardProps) {
  const dueLabel = task.dueDate ? new Date(task.dueDate).toLocaleDateString("ru-RU") : "Без срока";

  return (
    <article
      className={`task-card priority-${task.priority}`}
      draggable
      role="button"
      tabIndex={0}
      onClick={() => onOpen(task)}
      onDragStart={(event) => event.dataTransfer.setData("text/plain", task.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen(task);
        }
      }}
    >
      <div className="task-card__header">
        <h3>{task.title}</h3>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onRemove(task);
          }}
          aria-label="Удалить задачу"
        >
          x
        </button>
      </div>
      <p className="task-description">{task.description || "Описание пока не добавлено."}</p>
      <div className="task-meta">
        <span>{priorityLabels[task.priority]}</span>
        <span>{dueLabel}</span>
      </div>
      {task.tags.length > 0 && (
        <div className="tags">
          {task.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      )}
    </article>
  );
}

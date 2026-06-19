import type { BoardColumn } from "../../../entities/column/model/types";
import type { Task } from "../../../entities/task/model/types";
import { TaskCard } from "../../../entities/task/ui/TaskCard";

interface TaskBoardProps {
  columns: BoardColumn[];
  tasks: Task[];
  isLoading: boolean;
  onDropTask: (taskId: string, columnId: string) => void;
  onRemoveColumn: (column: BoardColumn) => void;
  onOpen: (task: Task) => void;
  onRemove: (task: Task) => void;
}

export function TaskBoard({ columns, tasks, isLoading, onDropTask, onRemoveColumn, onOpen, onRemove }: TaskBoardProps) {
  if (isLoading) {
    return <p className="empty-state">Задачи загружаются...</p>;
  }

  return (
    <div className="board">
      {columns.map((column) => {
        const columnTasks = tasks.filter((task) => task.status === column.id);

        return (
          <section
            className="column"
            key={column.id}
            onDragEnter={(event) => event.currentTarget.classList.add("column--drag-over")}
            onDragLeave={(event) => event.currentTarget.classList.remove("column--drag-over")}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              event.currentTarget.classList.remove("column--drag-over");
              onDropTask(event.dataTransfer.getData("text/plain"), column.id);
            }}
          >
            <div className="column-header">
              <h2>{column.title}</h2>
              <div className="column-actions">
                <span>{columnTasks.length}</span>
                {columns.length > 1 && (
                  <button type="button" onClick={() => onRemoveColumn(column)} aria-label={`Удалить колонку ${column.title}`}>
                    x
                  </button>
                )}
              </div>
            </div>
            {columnTasks.map((task) => (
              <TaskCard key={task.id} task={task} onOpen={onOpen} onRemove={onRemove} />
            ))}
            {columnTasks.length === 0 && <p className="empty-state">Перетащите задачу сюда</p>}
          </section>
        );
      })}
    </div>
  );
}

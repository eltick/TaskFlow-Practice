import { FormEvent, useEffect, useMemo, useState } from "react";
import { columnStorage } from "../../../entities/column/api/columnStorage";
import type { BoardColumn } from "../../../entities/column/model/types";
import { taskStorage } from "../../../entities/task/api/taskStorage";
import { emptyTaskDraft } from "../../../entities/task/model/constants";
import type { Task, TaskDraft, TaskFilters } from "../../../entities/task/model/types";

export function useTaskBoard() {
  const [columns, setColumns] = useState<BoardColumn[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draft, setDraft] = useState<TaskDraft>(emptyTaskDraft);
  const [columnTitle, setColumnTitle] = useState("");
  const [filters, setFilters] = useState<TaskFilters>({ search: "", priority: "all", status: "all" });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([columnStorage.list(), taskStorage.list()])
      .then(([nextColumns, nextTasks]) => {
        setColumns(nextColumns);
        setTasks(nextTasks);
        setDraft((current) => ({ ...current, status: nextColumns[0]?.id ?? "todo" }));
      })
      .catch(() => setError("Не удалось загрузить задачи."))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredTasks = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return tasks.filter((task) => {
      const text = `${task.title} ${task.description} ${task.tags.join(" ")}`.toLowerCase();
      const matchesSearch = !search || text.includes(search);
      const matchesPriority = filters.priority === "all" || task.priority === filters.priority;
      const matchesStatus = filters.status === "all" || task.status === filters.status;
      return matchesSearch && matchesPriority && matchesStatus;
    });
  }, [filters, tasks]);

  const submitTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.title.trim()) {
      setError("Введите название задачи.");
      return;
    }

    setError("");
    const created = await taskStorage.create(draft);
    setTasks((current) => [created, ...current]);
    setDraft({ ...emptyTaskDraft, status: columns[0]?.id ?? "todo" });
  };

  const submitColumn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!columnTitle.trim()) return;

    const created = await columnStorage.create(columnTitle);
    setColumns((current) => [...current, created]);
    setColumnTitle("");
  };

  const moveTask = async (taskId: string, columnId: string) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task || task.status === columnId) return;

    const updated = await taskStorage.update(taskId, { status: columnId });
    setTasks((current) => current.map((item) => (item.id === taskId ? updated : item)));
    setSelectedTask((current) => (current?.id === taskId ? updated : current));
  };

  const removeColumn = async (column: BoardColumn) => {
    if (columns.length <= 1) return;

    const nextColumns = await columnStorage.remove(column.id);
    const fallbackColumn = nextColumns[0];
    const movedTasks = await Promise.all(
      tasks.map((task) =>
        task.status === column.id ? taskStorage.update(task.id, { status: fallbackColumn.id }) : Promise.resolve(task),
      ),
    );

    setColumns(nextColumns);
    setTasks(movedTasks);
    setDraft((current) => ({ ...current, status: current.status === column.id ? fallbackColumn.id : current.status }));
    setFilters((current) => ({ ...current, status: current.status === column.id ? "all" : current.status }));
  };

  const removeTask = async (task: Task) => {
    await taskStorage.remove(task.id);
    setTasks((current) => current.filter((item) => item.id !== task.id));
    setSelectedTask((current) => (current?.id === task.id ? null : current));
  };

  return {
    columns,
    tasks,
    filteredTasks,
    draft,
    columnTitle,
    filters,
    selectedTask,
    isLoading,
    error,
    setDraft,
    setColumnTitle,
    setFilters,
    setSelectedTask,
    submitTask,
    submitColumn,
    moveTask,
    removeColumn,
    removeTask,
  };
}

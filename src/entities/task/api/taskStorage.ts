import { hasSupabaseConfig, supabaseRest } from "../../../shared/api/supabaseRest";
import type { Task, TaskDraft } from "../model/types";
import { fromDatabaseTask, normalizeTask, toDatabaseTask } from "./taskMappers";

const TASKS_KEY = "taskflow-practice-tasks";

const readLocalTasks = (): Task[] => {
  const raw = localStorage.getItem(TASKS_KEY);
  if (!raw) {
    localStorage.setItem(TASKS_KEY, JSON.stringify([]));
    return [];
  }

  try {
    const tasks = (JSON.parse(raw) as Array<Partial<Task>>).map(normalizeTask);
    writeLocalTasks(tasks);
    return tasks;
  } catch {
    localStorage.setItem(TASKS_KEY, JSON.stringify([]));
    return [];
  }
};

const writeLocalTasks = (tasks: Task[]) => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

const toTask = (draft: TaskDraft): Task => ({
  id: crypto.randomUUID(),
  title: draft.title.trim(),
  description: draft.description.trim(),
  status: draft.status,
  priority: draft.priority,
  dueDate: draft.dueDate,
  tags: draft.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const taskStorage = {
  async list(): Promise<Task[]> {
    if (hasSupabaseConfig) {
      const rows = await supabaseRest<Record<string, unknown>[]>("tasks?select=*&order=created_at.desc");
      return rows.map(fromDatabaseTask);
    }

    return readLocalTasks().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },

  async create(draft: TaskDraft): Promise<Task> {
    const task = toTask(draft);

    if (hasSupabaseConfig) {
      const rows = await supabaseRest<Record<string, unknown>[]>("tasks", {
        method: "POST",
        body: JSON.stringify(toDatabaseTask(task)),
      });
      return fromDatabaseTask(rows[0]);
    }

    writeLocalTasks([task, ...readLocalTasks()]);
    return task;
  },

  async update(id: string, changes: Partial<Task>): Promise<Task> {
    const nextChanges = { ...changes, updatedAt: new Date().toISOString() };

    if (hasSupabaseConfig) {
      const rows = await supabaseRest<Record<string, unknown>[]>(`tasks?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(toDatabaseTask(nextChanges)),
      });
      return fromDatabaseTask(rows[0]);
    }

    const tasks = readLocalTasks().map((task) => (task.id === id ? { ...task, ...nextChanges } : task));
    writeLocalTasks(tasks);
    const updated = tasks.find((task) => task.id === id);
    if (!updated) throw new Error("Задача не найдена.");
    return updated;
  },

  async remove(id: string): Promise<void> {
    if (hasSupabaseConfig) {
      await supabaseRest(`tasks?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
      return;
    }

    writeLocalTasks(readLocalTasks().filter((task) => task.id !== id));
  },

  async moveFromColumn(columnId: string, fallbackColumnId: string): Promise<Task[]> {
    if (hasSupabaseConfig) {
      const rows = await supabaseRest<Record<string, unknown>[]>(
        `tasks?status=eq.${encodeURIComponent(columnId)}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: fallbackColumnId,
            updated_at: new Date().toISOString(),
          }),
        },
      );
      return rows.map(fromDatabaseTask);
    }

    const movedTasks = readLocalTasks().map((task) =>
      task.status === columnId ? { ...task, status: fallbackColumnId, updatedAt: new Date().toISOString() } : task,
    );
    writeLocalTasks(movedTasks);
    return movedTasks;
  },
};

import type { Task } from "../model/types";

export const toDatabaseTask = (task: Partial<Task>) => ({
  id: task.id,
  title: task.title,
  description: task.description,
  status: task.status,
  priority: task.priority,
  due_date: task.dueDate || null,
  tags: task.tags,
  created_at: task.createdAt,
  updated_at: task.updatedAt,
});

export const fromDatabaseTask = (task: Record<string, unknown>): Task => ({
  id: String(task.id),
  title: String(task.title ?? ""),
  description: String(task.description ?? ""),
  status: String(task.status ?? "todo"),
  priority: task.priority as Task["priority"],
  dueDate: String(task.due_date ?? ""),
  tags: Array.isArray(task.tags) ? task.tags.map(String) : [],
  createdAt: String(task.created_at ?? new Date().toISOString()),
  updatedAt: String(task.updated_at ?? task.created_at ?? new Date().toISOString()),
});

export const normalizeTask = (task: Partial<Task>): Task => ({
  id: String(task.id ?? crypto.randomUUID()),
  title: String(task.title ?? ""),
  description: String(task.description ?? ""),
  status: String(task.status ?? "todo"),
  priority: task.priority ?? "medium",
  dueDate: String(task.dueDate ?? ""),
  tags: Array.isArray(task.tags) ? task.tags.map(String) : [],
  createdAt: String(task.createdAt ?? new Date().toISOString()),
  updatedAt: String(task.updatedAt ?? task.createdAt ?? new Date().toISOString()),
});

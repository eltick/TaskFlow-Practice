import type { TaskDraft, TaskPriority, TaskStatus } from "./types";

export const priorityLabels: Record<TaskPriority, string> = {
  low: "Низкий",
  medium: "Средний",
  high: "Высокий",
};

export const emptyTaskDraft: TaskDraft = {
  title: "",
  description: "",
  status: "todo" as TaskStatus,
  priority: "medium" as TaskPriority,
  dueDate: "",
  tags: "",
};

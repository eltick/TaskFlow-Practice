import type { BoardColumn } from "../../../entities/column/model/types";
import { priorityLabels } from "../../../entities/task/model/constants";
import type { TaskFilters as Filters } from "../../../entities/task/model/types";

interface TaskFiltersProps {
  columns: BoardColumn[];
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function TaskFilters({ columns, filters, onChange }: TaskFiltersProps) {
  return (
    <div className="filters">
      <input
        value={filters.search}
        onChange={(event) => onChange({ ...filters, search: event.target.value })}
        placeholder="Поиск по задачам"
      />
      <select value={filters.status} onChange={(event) => onChange({ ...filters, status: event.target.value })}>
        <option value="all">Все колонки</option>
        {columns.map((column) => (
          <option key={column.id} value={column.id}>
            {column.title}
          </option>
        ))}
      </select>
      <select
        value={filters.priority}
        onChange={(event) => onChange({ ...filters, priority: event.target.value as Filters["priority"] })}
      >
        <option value="all">Все приоритеты</option>
        {Object.entries(priorityLabels).map(([id, label]) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

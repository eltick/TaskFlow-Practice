import { hasSupabaseConfig, supabaseRest } from "../../../shared/api/supabaseRest";
import { defaultColumns } from "../model/constants";
import type { BoardColumn } from "../model/types";

const COLUMNS_KEY = "taskflow-practice-columns";

const makeColumnId = (title: string) =>
  title
    .trim()
    .toLowerCase()
    .replace(/[^a-zа-я0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "") || crypto.randomUUID();

const normalizeColumn = (column: Partial<BoardColumn>): BoardColumn => ({
  id: String(column.id ?? crypto.randomUUID()),
  title: String(column.title ?? "Новая колонка"),
});

const fromColumnRow = (row: Record<string, unknown>): BoardColumn => ({
  id: String(row.id),
  title: String(row.title ?? "Новая колонка"),
});

const toColumnRow = (column: BoardColumn, position: number) => ({
  id: column.id,
  title: column.title,
  position,
  updated_at: new Date().toISOString(),
});

const readLocalColumns = (): BoardColumn[] => {
  const raw = localStorage.getItem(COLUMNS_KEY);
  if (!raw) {
    localStorage.setItem(COLUMNS_KEY, JSON.stringify(defaultColumns));
    return defaultColumns;
  }

  try {
    const columns = (JSON.parse(raw) as Array<Partial<BoardColumn>>)
      .map(normalizeColumn)
      .filter((column) => column.title.trim());

    return columns.length > 0 ? columns : defaultColumns;
  } catch {
    localStorage.setItem(COLUMNS_KEY, JSON.stringify(defaultColumns));
    return defaultColumns;
  }
};

const writeLocalColumns = (columns: BoardColumn[]) => {
  localStorage.setItem(COLUMNS_KEY, JSON.stringify(columns));
};

const seedRemoteColumns = async () => {
  const rows = await supabaseRest<Record<string, unknown>[]>("task_columns", {
    method: "POST",
    body: JSON.stringify(defaultColumns.map((column, index) => toColumnRow(column, index))),
  });

  return rows.map(fromColumnRow);
};

export const columnStorage = {
  async list(): Promise<BoardColumn[]> {
    if (hasSupabaseConfig) {
      const rows = await supabaseRest<Record<string, unknown>[]>("task_columns?select=*&order=position.asc");
      return rows.length > 0 ? rows.map(fromColumnRow) : seedRemoteColumns();
    }

    return readLocalColumns();
  },

  async create(title: string): Promise<BoardColumn> {
    const columns = await this.list();
    const baseId = makeColumnId(title);
    const id = columns.some((column) => column.id === baseId) ? `${baseId}-${crypto.randomUUID().slice(0, 8)}` : baseId;
    const column: BoardColumn = { id, title: title.trim() };

    if (hasSupabaseConfig) {
      const rows = await supabaseRest<Record<string, unknown>[]>("task_columns", {
        method: "POST",
        body: JSON.stringify(toColumnRow(column, columns.length)),
      });
      return fromColumnRow(rows[0]);
    }

    writeLocalColumns([...columns, column]);
    return column;
  },

  async remove(columnId: string): Promise<BoardColumn[]> {
    const columns = await this.list();
    if (columns.length <= 1) {
      throw new Error("Нельзя удалить последнюю колонку.");
    }

    const nextColumns = columns.filter((column) => column.id !== columnId);

    if (hasSupabaseConfig) {
      await supabaseRest(`task_columns?id=eq.${encodeURIComponent(columnId)}`, {
        method: "DELETE",
        headers: { Prefer: "return=minimal" },
      });
      return nextColumns;
    }

    writeLocalColumns(nextColumns);
    return nextColumns;
  },
};

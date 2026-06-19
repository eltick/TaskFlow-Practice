import { FormEvent } from "react";

interface ColumnFormProps {
  title: string;
  onChange: (title: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

export function ColumnForm({ title, onChange, onSubmit }: ColumnFormProps) {
  return (
    <form className="column-form" onSubmit={onSubmit}>
      <input
        value={title}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Название новой колонки"
      />
      <button type="submit">Добавить колонку</button>
    </form>
  );
}

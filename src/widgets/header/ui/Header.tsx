interface HeaderProps {
  columnCount: number;
  taskCount: number;
}

export function Header({ columnCount, taskCount }: HeaderProps) {
  return (
    <section className="topbar">
      <div>
        <p className="eyebrow">Канбан-доска</p>
        <h1>TaskFlow Practice</h1>
        <p className="lead">
          Создавайте задачи и колонки, переносите карточки мышью и открывайте подробности задачи.
        </p>
      </div>
      <div className="topbar-stats">
        <span>{taskCount} задач</span>
        <span>{columnCount} колонок</span>
      </div>
    </section>
  );
}

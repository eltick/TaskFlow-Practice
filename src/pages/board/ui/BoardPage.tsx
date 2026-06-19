import { TaskModal } from "../../../entities/task/ui/TaskModal";
import { TaskFilters } from "../../../features/task-filter/ui/TaskFilters";
import { Header } from "../../../widgets/header/ui/Header";
import { TaskSidebar } from "../../../widgets/sidebar/ui/TaskSidebar";
import { TaskBoard } from "../../../widgets/task-board/ui/TaskBoard";
import { useTaskBoard } from "../model/useTaskBoard";

export function BoardPage() {
  const board = useTaskBoard();

  return (
    <main className="app-shell">
      <Header columnCount={board.columns.length} taskCount={board.tasks.length} />

      <section className="workspace">
        <TaskSidebar
          columns={board.columns}
          draft={board.draft}
          error={board.error}
          columnTitle={board.columnTitle}
          onDraftChange={board.setDraft}
          onColumnTitleChange={board.setColumnTitle}
          onSubmitTask={board.submitTask}
          onSubmitColumn={board.submitColumn}
        />

        <section className="board-area">
          <TaskFilters filters={board.filters} onChange={board.setFilters} columns={board.columns} />
          <TaskBoard
            columns={board.columns}
            tasks={board.filteredTasks}
            isLoading={board.isLoading}
            onDropTask={board.moveTask}
            onRemoveColumn={board.removeColumn}
            onOpen={board.setSelectedTask}
            onRemove={board.removeTask}
          />
        </section>
      </section>

      <TaskModal columns={board.columns} task={board.selectedTask} onClose={() => board.setSelectedTask(null)} />
    </main>
  );
}

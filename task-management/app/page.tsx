import { KanbanBoard } from "@/components/kanban-board"
import { TaskDashboard } from "@/components/task-dashboard"
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Kanban Task Manager</h1>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-6">
        <KanbanBoard />
      </main>
      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Kanban Task Manager
        </div>
      </footer>
    </div>
  )
}

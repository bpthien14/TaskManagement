import { TaskForm } from "@/components/task-form"

export default function NewTaskPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Task</h1>
      <TaskForm />
    </div>
  )
}

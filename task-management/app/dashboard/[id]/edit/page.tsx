import { TaskForm } from "@/components/task-form"

export default function EditTaskPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Task</h1>
      <TaskForm id={params.id} />
    </div>
  )
}

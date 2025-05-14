import { TaskDetail } from "@/components/task-detail"

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  return <TaskDetail id={params.id} />
}

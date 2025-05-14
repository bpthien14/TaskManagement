"use client"

import { useDrop } from "react-dnd"
import { TaskCard } from "@/components/task-card"
import type { Task } from "@/lib/types"

interface TaskColumnProps {
  title: string
  tasks: Task[]
  status: string
  onMoveTask: (taskId: string, newStatus: string) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (taskId: string) => void
}

export function TaskColumn({ title, tasks, status, onMoveTask, onEditTask, onDeleteTask }: TaskColumnProps) {
  const [{ isOver }, drop] = useDrop({
    accept: "task",
    drop: (item: { id: string }) => {
      onMoveTask(item.id, status)
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  return (
    <div
      ref={drop}
      className={`flex flex-col h-[calc(100vh-240px)] min-h-[500px] rounded-lg border bg-card ${
        isOver ? "border-primary" : ""
      }`}
    >
      <div className="p-4 border-b bg-muted/50">
        <h2 className="font-semibold">
          {title} ({tasks.length})
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">No tasks</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task._id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

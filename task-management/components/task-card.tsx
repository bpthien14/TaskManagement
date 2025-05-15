"use client"

import { useDrag } from "react-dnd"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Edit, Trash2, User } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Task } from "@/lib/types"

interface TaskCardProps {
  task: Task
  onEdit: () => void
  onDelete: () => void
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: "task",
    item: { id: task._id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  const getPriorityColor = (priority: string): string => {
    const lowerPriority = priority?.toLowerCase() || 'medium';
    switch (lowerPriority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card ref={drag} className={`cursor-move ${isDragging ? "opacity-50" : ""}`}>
      <CardContent className="p-3 space-y-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium line-clamp-2">{task.title}</h3>
          {task.priority && (
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
          )}
        </div>
        
        {task.description && <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>}
        
        <div className="space-y-1 mt-2">
          {task.dueDate && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" />
              {formatDate(new Date(task.dueDate))}
            </div>
          )}
          
          {task.assignee && (
            <div className="flex items-center text-xs text-muted-foreground">
              <User className="mr-1 h-3 w-3" />
              {task.assignee}
            </div>
          )}
        </div>
        
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-2 pt-0 flex justify-end gap-1">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onEdit}>
          <Edit className="h-3 w-3" />
          <span className="sr-only">Edit</span>
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onDelete}>
          <Trash2 className="h-3 w-3" />
          <span className="sr-only">Delete</span>
        </Button>
      </CardFooter>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Edit, User, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { formatDate } from "@/lib/utils"
import { getTaskById, deleteTask } from "@/lib/api/tasks"
import type { Task } from "@/lib/types"

interface TaskDetailProps {
  id: string
}

export function TaskDetail({ id }: TaskDetailProps) {
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setIsLoading(true)
        const fetchedTask = await getTaskById(id)
        setTask(fetchedTask)
      } catch (error) {
        console.error('Lỗi khi tải task:', error)
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin task",
          variant: "destructive",
        })
        router.push("/dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTask()
  }, [id, router])

  const handleDelete = async () => {
    if (confirm("Bạn có chắc chắn muốn xóa task này không?")) {
      try {
        await deleteTask(id)
        toast({
          title: "Task đã được xóa",
          description: "Task đã được xóa thành công.",
        })
        router.push("/dashboard")
      } catch (error) {
        console.error('Lỗi khi xóa task:', error)
        toast({
          title: "Lỗi",
          description: "Không thể xóa task",
          variant: "destructive",
        })
      }
    }
  }

  const getStatusColor = (status: string) => {
    const lowerStatus = status.toLowerCase()
    switch (lowerStatus) {
      case "to do":
      case "todo":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "in progress":
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "done":
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getPriorityColor = (priority: string) => {
    const lowerPriority = priority.toLowerCase()
    switch (lowerPriority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Đang tải task...</p>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">Không tìm thấy task</h3>
        <p className="text-muted-foreground mt-1">Task bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Button className="mt-4" onClick={() => router.push("/dashboard")}>
          Quay lại Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Quay lại Dashboard
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" /> Xóa
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
            <CardTitle className="text-2xl">{task.title}</CardTitle>
            <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Mô tả</h3>
            <p className="text-muted-foreground whitespace-pre-line">
              {task.description || "Không có mô tả."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Ngày hết hạn</h3>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                {formatDate(new Date(task.dueDate))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Độ ưu tiên</h3>
              <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
            </div>
          </div>

          {task.assignee && (
            <div>
              <h3 className="text-lg font-medium mb-2">Người phụ trách</h3>
              <div className="flex items-center text-muted-foreground">
                <User className="mr-2 h-4 w-4" />
                {task.assignee}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium mb-2">Trạng thái hoàn thành</h3>
            <Badge variant={task.completed ? "success" : "outline"}>
              {task.completed ? "Đã hoàn thành" : "Chưa hoàn thành"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { TaskColumn } from "@/components/task-column"
import { TaskDialog } from "@/components/task-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Tag, X } from "lucide-react"
import type { Task } from "@/lib/types"
import { getAllTasks, createTask, updateTask, deleteTask, updateTaskStatus } from "@/lib/api/tasks"
import { toast } from "@/hooks/use-toast"


export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        const fetchedTasks = await getAllTasks()
        console.log("Fetched tasks:", fetchedTasks)
        setTasks(fetchedTasks)
        setFilteredTasks(fetchedTasks)
        setError(null)
      } catch (err) {
        console.error('Lỗi khi tải tasks:', err)
        setError('Không thể tải danh sách task. Vui lòng thử lại sau.')
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách task.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  // Lọc task khi searchQuery hoặc selectedTags thay đổi
  useEffect(() => {
    if (tasks.length === 0) return

    let filtered = [...tasks]
    
    if (searchQuery) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (selectedTags.length > 0 && filtered.some(task => task.tags)) {
      filtered = filtered.filter((task) => 
        task.tags && selectedTags.some((tag) => task.tags.includes(tag))
      )
    }

    setFilteredTasks(filtered)
  }, [tasks, searchQuery, selectedTags])

  const allTags = Array.from(
    new Set(
      tasks
        .filter(task => task.tags && Array.isArray(task.tags))
        .flatMap((task) => task.tags || [])
    )
  )

  const todoTasks = filteredTasks.filter((task) => 
    task.status === "todo" || task.status === "To Do"
  )
  
  const inProgressTasks = filteredTasks.filter((task) => 
    task.status === "in-progress" || task.status === "In Progress"
  )
  
  const doneTasks = filteredTasks.filter((task) => 
    task.status === "done" || task.status === "Done"
  )

  const moveTask = async (taskId: string, newStatus: string) => {
    try {
      setTasks((prevTasks) => 
        prevTasks.map((task) => 
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      )
      
      const updatedTask = await updateTaskStatus(taskId, newStatus)
      console.log("Đã di chuyển task:", updatedTask)
      
      setTasks((prevTasks) => 
        prevTasks.map((task) => 
          task._id === taskId ? updatedTask : task
        )
      )
    } catch (err) {
      console.error("Lỗi khi di chuyển task:", err)
      toast({
        title: "Lỗi",
        description: "Không thể di chuyển task. Vui lòng thử lại.",
        variant: "destructive"
      })
      
      const currentTask = tasks.find((t) => t._id === taskId)
      if (currentTask) {
        setTasks((prevTasks) => [...prevTasks])
      }
    }
  }

  const handleCreateTask = async (taskData: Omit<Task, "_id">) => {
    try {
      const newTask = await createTask(taskData)
      setTasks((prevTasks) => [...prevTasks, newTask])
      toast({
        title: "Thành công",
        description: "Đã tạo task mới."
      })
    } catch (err) {
      console.error("Lỗi khi tạo task:", err)
      toast({
        title: "Lỗi",
        description: "Không thể tạo task mới. Vui lòng thử lại.",
        variant: "destructive"
      })
    }
  }

  const handleUpdateTask = async (updatedTaskData: Task) => {
    try {
      const { _id, ...taskData } = updatedTaskData
      const updatedTask = await updateTask(_id, taskData)
      
      setTasks((prevTasks) => 
        prevTasks.map((task) => 
          task._id === _id ? updatedTask : task
        )
      )
      
      toast({
        title: "Thành công",
        description: "Đã cập nhật task."
      })
    } catch (err) {
      console.error("Lỗi khi cập nhật task:", err)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật task. Vui lòng thử lại.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId)
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId))
      toast({
        title: "Thành công",
        description: "Đã xóa task."
      })
    } catch (err) {
      console.error("Lỗi khi xóa task:", err)
      toast({
        title: "Lỗi",
        description: "Không thể xóa task. Vui lòng thử lại.",
        variant: "destructive"
      })
      
      const fetchTasks = async () => {
        const fetchedTasks = await getAllTasks()
        setTasks(fetchedTasks)
      }
      fetchTasks().catch(console.error)
    }
  }

  const openEditTaskDialog = (task: Task) => {
    setEditingTask(task)
    setIsTaskDialogOpen(true)
  }

  const openCreateTaskDialog = () => {
    setEditingTask(null)
    setIsTaskDialogOpen(true)
  }

  const toggleTagFilter = (tag: string) => {
    setSelectedTags((prevTags) => 
      prevTags.includes(tag) 
        ? prevTags.filter((t) => t !== tag) 
        : [...prevTags, tag]
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading tasks</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p className="text-lg">{error}</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => window.location.reload()}
        >
          Reloading
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 flex items-center relative">
          <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm task..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={openCreateTaskDialog}>
          <Plus className="mr-2 h-4 w-4" /> Tạo Task mới
        </Button>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleTagFilter(tag)}
              >
                {tag}
                {selectedTags.includes(tag) && <X className="ml-1 h-3 w-3" />}
              </Badge>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setSelectedTags([])} className="text-xs h-7 px-2">
              Remove filter
            </Button>
          )}
        </div>
      )}

      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TaskColumn
            title="To do "
            tasks={todoTasks}
            status="To Do"
            onMoveTask={moveTask}
            onEditTask={openEditTaskDialog}
            onDeleteTask={handleDeleteTask}
          />
          <TaskColumn
            title="In Progress"
            tasks={inProgressTasks}
            status="In Progress"
            onMoveTask={moveTask}
            onEditTask={openEditTaskDialog}
            onDeleteTask={handleDeleteTask}
          />
          <TaskColumn
            title="Done"
            tasks={doneTasks}
            status="Done"
            onMoveTask={moveTask}
            onEditTask={openEditTaskDialog}
            onDeleteTask={handleDeleteTask}
          />
        </div>
      </DndProvider>

      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        task={editingTask}
        onCreateTask={handleCreateTask}
        onUpdateTask={handleUpdateTask}
      />
    </div>
  )
}

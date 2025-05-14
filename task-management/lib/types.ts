// Các kiểu dữ liệu cho các task trong ứng dụng
export interface Task {
  _id: string;
  title: string;
  completed: boolean;
  assignee: string;
  description: string;  
  status: string;
  priority: string;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Kiểu dữ liệu cho việc tạo task mới
export interface CreateTaskDTO {
  title: string;
  assignee?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: Date;
}

// Kiểu dữ liệu cho việc cập nhật task
export interface UpdateTaskDTO {
  title?: string;
  completed?: boolean;
  assignee?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: Date;
}

// Trạng thái của task
export enum TaskStatus {
  TODO = "To Do",
  IN_PROGRESS = "In Progress",
  DONE = "Done"
}

// Độ ưu tiên của task
export enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High"
}

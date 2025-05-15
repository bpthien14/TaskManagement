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

export interface CreateTaskDTO {
  title: string;
  assignee?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: Date;
}

export interface UpdateTaskDTO {
  title?: string;
  completed?: boolean;
  assignee?: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: Date;
}

export enum TaskStatus {
  TODO = "To Do",
  IN_PROGRESS = "In Progress",
  DONE = "Done"
}

export enum TaskPriority {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High"
}

export interface ITask extends Document {
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

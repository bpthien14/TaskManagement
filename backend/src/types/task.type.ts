export interface ITask extends Document {
    title: string;
    completed: boolean;
    description: string;  
    status: string;
    priority: string;
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

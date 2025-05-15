import Task from "../models/task.model";
import { Request, Response, NextFunction } from "express";
import { createError } from "../utils/error";
import { Document } from "mongoose";
import { ITask } from "../types/task.type";

function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args: any[]) {
    console.log(`Method ${propertyKey} called with parameters:`, args);
    const result = originalMethod.apply(this, args);
    console.log(`Returned result:`, result);
    return result;
    };
}
class Calculator {
    @log
    add(a: number, b: number) {
    return a + b;
    }
}

const calc = new Calculator();
calc.add(2, 3);

class TaskController {
    constructor() {}
    
    createTask = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const newTask = new Task({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status || "To Do",
            priority: req.body.priority || "Medium",
            dueDate: req.body.dueDate,
            completed: req.body.completed || false,
        });
        try {
            const savedTask = await newTask.save();
            res.status(200).json(savedTask);
        } catch (err) {
            next(err);
        }
    };
    updateTask = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const task = (await Task.findById(req.params.taskId)
                .lean()
                .exec()) as unknown as ITask;
            if (!task) {
                next(
                    createError({ status: 404, message: "Task not found" })
                );
                return;
            }
    
            const updatedTask = await Task.findByIdAndUpdate(
                req.params.taskId,
                {
                    title: req.body.title,
                    description: req.body.description,
                    status: req.body.status,
                    priority: req.body.priority,
                    dueDate: req.body.dueDate,
                    completed: req.body.completed,
                },
                { new: true }
            );
    
            res.status(200).json(updatedTask);
            return;
        } catch (err) {
            next(err);
            return;
        }
    };
    getAllTasks = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            console.log("Đang lấy tất cả task");
            const tasks = await Task.find({});
            res.status(200).json(tasks);
        } catch (err) {
            next(err);
        }
    };
    deleteTask = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const task = (await Task.findById(req.params.taskId)
                .lean()
                .exec()) as unknown as ITask;
    
            if (!task) {
                return next(
                    createError({ status: 404, message: "Task not found" })
                );
            }
    
            await Task.findByIdAndDelete(req.params.taskId);
            res.status(200).json({ message: "Task deleted successfully" });
        } catch (err) {
            next(err);
            return;
        }
    };
    deleteAllTasks = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            await Task.deleteMany({});
            res.json("All Tasks Deleted Successfully");
        } catch (err) {
            next(err);
        }
    };
    updateTaskStatus = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { taskId } = req.params;
            const { status } = req.body;
    
            if (!status) {
                return next(
                    createError({ status: 400, message: "Status is required" })
                );
            }
    
            const task = await Task.findById(taskId);
            
            if (!task) {
                return next(
                    createError({ status: 404, message: "Task not found" })
                );
            }
    
            const updatedTask = await Task.findByIdAndUpdate(
                taskId,
                { status },
                { new: true }
            );
    
            res.status(200).json(updatedTask);
        } catch (err) {
            next(err);
        }
    };
}

export default new TaskController();

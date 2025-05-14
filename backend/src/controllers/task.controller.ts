import Task from "../models/task.model";
import { Request, Response, NextFunction } from "express";
import { createError } from "../utils/error";
import { Document } from "mongoose";
import { ITask } from "../types/task.type";

declare global {
    namespace Express {
        interface Request {
            user: {
                id: string;
            };
        }
    }
}

export const createTask = async (
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

export const updateTask = async (
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

export const getAllTasks = async (
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

export const deleteTask = async (
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

export const deleteAllTasks = async (
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

export const updateTaskStatus = async (
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

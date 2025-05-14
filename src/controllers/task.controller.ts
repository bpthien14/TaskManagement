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
        user: req.user.id,
        completed: req.body.completed,
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


        if (!task.assignee)
            next(
                createError({ status: 404, message: "Task has no assignee" })
            );

        if (task.assignee.toString() !== req.user.id) {
            next(
                createError({
                    status: 401,
                    message: "You're not assigned to this task",
                })
            );
            return;
        }


        const updatedTask = await Task.findByIdAndUpdate(
            req.params.taskId,
            {
                title: req.body.title,
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
        const tasks = await Task.find({});
        res.status(200).json(tasks);
    } catch (err) {
        next(err);
    }
};

export const getCurrentUserTasks = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const tasks = await Task.find({ user: req.user.id }) as unknown as ITask[];
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

        if (task.assignee && task.assignee.toString() !== req.user.id) {
            return next(
                createError({ status: 401, message: "It's not your todo." })
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
        await Task.deleteMany({ user: req.user.id });
        res.json("All Todo Deleted Successfully");
    } catch (err) {
        next(err);
    }
};

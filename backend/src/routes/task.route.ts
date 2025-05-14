import express from "express";
import { createTask, deleteAllTasks, deleteTask, getAllTasks, updateTask, updateTaskStatus } from "../controllers/task.controller";

const router = express.Router();

router.get('/', getAllTasks);

router.post("/", createTask);

router.put("/:taskId", updateTask);

router.patch("/:taskId/status", updateTaskStatus);

router.delete('/deleteAll', deleteAllTasks);

router.delete('/:taskId', deleteTask);

export default router;
import express from "express";
import TaskController from "../controllers/task.controller";

const router = express.Router();

router.get('/', TaskController.getAllTasks);

router.post("/", TaskController.createTask);

router.put("/:taskId", TaskController.updateTask);

router.patch("/:taskId/status", TaskController.updateTaskStatus);

router.delete('/deleteAll', TaskController.deleteAllTasks);

router.delete('/:taskId', TaskController.deleteTask);

export default router;
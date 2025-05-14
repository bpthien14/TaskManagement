import express from "express";
import { createTask, deleteAllTasks, deleteTask, getAllTasks, getCurrentUserTasks, updateTask } from "../controllers/task.controller";

const router = express.Router();

router.get('/all', getAllTasks);

router.post("/", createTask);

router.put("/:taskId", updateTask);

router.get('/myTasks', getCurrentUserTasks);

router.delete('/deleteAll', deleteAllTasks);

router.delete('/:taskId', deleteTask);


export default router;
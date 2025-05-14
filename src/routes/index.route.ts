import express from "express";
import tasksRoutes from './task.route';

const router = express.Router();

router.use('/tasks', tasksRoutes);


export default router;
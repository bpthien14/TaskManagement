import { Task, CreateTaskDTO, UpdateTaskDTO } from "../types";
import { API_BASE_URL, getHeaders, handleApiResponse } from "./config";

const TASKS_ENDPOINT = `${API_BASE_URL}/tasks`;

export async function getAllTasks(): Promise<Task[]> {
    const response = await fetch(TASKS_ENDPOINT, {
        method: "GET",
        headers: getHeaders(),
    });

    return handleApiResponse<Task[]>(response);
}

export async function getTaskById(taskId: string): Promise<Task> {
    const response = await fetch(`${TASKS_ENDPOINT}/${taskId}`, {
        method: "GET",
        headers: getHeaders(),
    });

    return handleApiResponse<Task>(response);
}

export async function createTask(taskData: CreateTaskDTO): Promise<Task> {
    const response = await fetch(TASKS_ENDPOINT, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(taskData),
    });

    return handleApiResponse<Task>(response);
}

export async function updateTask(
    taskId: string,
    taskData: UpdateTaskDTO
): Promise<Task> {
    const response = await fetch(`${TASKS_ENDPOINT}/${taskId}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(taskData),
    });

    return handleApiResponse<Task>(response);
}

export async function deleteTask(taskId: string): Promise<void> {
    const response = await fetch(`${TASKS_ENDPOINT}/${taskId}`, {
        method: "DELETE",
        headers: getHeaders(),
    });

    return handleApiResponse<void>(response);
}

export async function updateTaskStatus(
    taskId: string,
    status: string
): Promise<Task> {
    const response = await fetch(`${TASKS_ENDPOINT}/${taskId}/status`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({ status }),
    });

    return handleApiResponse<Task>(response);
}

export async function toggleTaskCompletion(
    taskId: string,
    completed: boolean
): Promise<Task> {
    return updateTask(taskId, { completed });
}

import { apiClient } from '../client';
import type { TaskRead, TaskCreate, TaskUpdate, TaskListResponse } from './types';

export const getTasks = async (projectId: string, filters?: Record<string, unknown>): Promise<TaskListResponse> => {
  const response = await apiClient.get<TaskListResponse>(`/projects/${projectId}/tasks`, { params: filters });
  return response.data;
};

export const createTask = async (projectId: string, data: TaskCreate): Promise<TaskRead> => {
  const response = await apiClient.post<TaskRead>(`/projects/${projectId}/tasks`, data);
  return response.data;
};

export const updateTask = async (id: string, data: TaskUpdate): Promise<TaskRead> => {
  const response = await apiClient.patch<TaskRead>(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await apiClient.delete(`/tasks/${id}`);
};

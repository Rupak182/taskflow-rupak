import { apiClient } from '../client';
import type { ProjectRead, ProjectCreate, ProjectUpdate, ProjectListResponse } from './types';

export const getProjects = async (page = 1, limit = 20): Promise<ProjectListResponse> => {
  const response = await apiClient.get<ProjectListResponse>('/projects', { params: { page, limit } });
  return response.data;
};

export const getProject = async (id: string): Promise<ProjectRead> => {
  const response = await apiClient.get<ProjectRead>(`/projects/${id}`);
  return response.data;
};

export const createProject = async (data: ProjectCreate): Promise<ProjectRead> => {
  const response = await apiClient.post<ProjectRead>('/projects', data);
  return response.data;
};

export const updateProject = async (id: string, data: ProjectUpdate): Promise<ProjectRead> => {
  const response = await apiClient.patch<ProjectRead>(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await apiClient.delete(`/projects/${id}`);
};

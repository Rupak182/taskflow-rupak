import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import type { TaskCreate, TaskUpdate } from './types';
import { queryKeys } from '../queryKeys';

export const useTasks = (projectId: string, filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: queryKeys.tasks.list(projectId, filters),
    queryFn: () => getTasks(projectId, filters),
    enabled: !!projectId,
  });
};

export const useCreateTask = (projectId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: TaskCreate) => createTask(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.list(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskUpdate }) => updateTask(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.list(data.project_id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(data.project_id) });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.base });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.base });
    },
  });
};

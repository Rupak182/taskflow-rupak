import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, updateTask, deleteTask } from './api';
import type { TaskCreate, TaskUpdate, TaskRead } from './types';
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
      queryClient.invalidateQueries({ queryKey: [...queryKeys.tasks.base, 'list', projectId] });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
    },
  });
};

export const useUpdateTask = (projectId?: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskUpdate }) => updateTask(id, data),
    onMutate: async ({ id, data }) => {
      if (!projectId) return;

      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.list(projectId) });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData<{ tasks: TaskRead[] }>(queryKeys.tasks.list(projectId));

      // Optimistically update to the new value
      if (previousTasks) {
        queryClient.setQueryData<{ tasks: TaskRead[] }>(queryKeys.tasks.list(projectId), {
          ...previousTasks,
          tasks: previousTasks.tasks.map((task) =>
            task.id === id ? { ...task, ...data } : task
          ),
        });
      }

      // Return a context object with the snapshotted value
      return { previousTasks, projectId };
    },
    onError: (_err, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTasks && context?.projectId) {
        queryClient.setQueryData(queryKeys.tasks.list(context.projectId), context.previousTasks);
      }
    },
    onSettled: (data, _err, _variables, context) => {
      // Always refetch after error or success to ensure we represent absolute truth from backend
      const pid = data?.project_id || context?.projectId;
      if (pid) {
        queryClient.invalidateQueries({ queryKey: [...queryKeys.tasks.base, 'list', pid] });
        queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(pid) });
      }
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

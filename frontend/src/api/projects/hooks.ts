import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjects, getProject, createProject, updateProject, deleteProject } from './api';
import type { ProjectCreate, ProjectUpdate } from './types';
import { queryKeys } from '../queryKeys';

export const useProjects = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: queryKeys.projects.list({ page, limit }),
    queryFn: () => getProjects(page, limit),
  });
};

export const useProjectDetails = (id: string) => {
  return useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () => getProject(id),
    enabled: !!id,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ProjectCreate) => createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.base });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProjectUpdate }) => updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.base });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.base });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.list(id) });
    },
  });
};

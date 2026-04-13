export const queryKeys = {
  auth: {
    base: ['auth'] as const,
    user: () => [...queryKeys.auth.base, 'user'] as const,
    users: () => [...queryKeys.auth.base, 'users'] as const,
  },
  projects: {
    base: ['projects'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.projects.base, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.projects.base, 'detail', id] as const,
  },
  tasks: {
    base: ['tasks'] as const,
    list: (projectId: string, filters?: Record<string, unknown>) => [...queryKeys.tasks.base, 'list', projectId, filters] as const,
  },
};

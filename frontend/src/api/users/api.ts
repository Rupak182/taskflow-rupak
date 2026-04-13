import { apiClient } from '../client';
import type { UserRead } from './types';

export const getUsers = async (): Promise<UserRead[]> => {
  const response = await apiClient.get<UserRead[]>('/auth/users');
  return response.data;
};

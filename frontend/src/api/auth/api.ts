import { apiClient } from '../client';
import type { AuthResponseModel, UserCreateModel, UserLoginModel } from './types';

export const login = async (data: UserLoginModel): Promise<AuthResponseModel> => {
  const response = await apiClient.post<AuthResponseModel>('/auth/login', data);
  return response.data;
};

export const register = async (data: UserCreateModel): Promise<AuthResponseModel> => {
  const response = await apiClient.post<AuthResponseModel>('/auth/register', data);
  return response.data;
};

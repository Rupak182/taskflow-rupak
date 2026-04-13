import { useMutation } from '@tanstack/react-query';
import { login, register } from './api';
import type { UserCreateModel, UserLoginModel, AuthResponseModel } from './types';

export const useLogin = () => {
  return useMutation<AuthResponseModel, Error, UserLoginModel>({
    mutationFn: login,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
  });
};

export const useRegister = () => {
  return useMutation<AuthResponseModel, Error, UserCreateModel>({
    mutationFn: register,
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
  });
};

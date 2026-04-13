import { useQuery } from '@tanstack/react-query';
import { getUsers } from './api';
import { queryKeys } from '../queryKeys';

export const useUsers = () => {
  return useQuery({
    queryKey: queryKeys.auth.users(),
    queryFn: getUsers,
  });
};

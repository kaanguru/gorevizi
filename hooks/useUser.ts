import { useQuery } from '@tanstack/react-query';

import { getUser } from '~/utils/auth/getUser';

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
  });
};

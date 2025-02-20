import { useQuery } from '@tanstack/react-query';

import { supabase } from '~/utils/supabase';

export const useSession = () => {
  return useQuery({
    queryKey: ['session'],
    queryFn: getSession,
  });
};
async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return data;
}

import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';

export function useContingencyList(params = {}) {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== null),
  );
  return useQuery({
    queryKey: ['contingency', 'list', cleanParams],
    queryFn: async () => {
      const { data } = await api.get('/contingency', { params: cleanParams });
      return data.data;
    },
    keepPreviousData: true,
  });
}

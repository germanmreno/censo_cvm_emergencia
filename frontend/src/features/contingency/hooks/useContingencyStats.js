import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';

export function useContingencyStats() {
  return useQuery({
    queryKey: ['contingency', 'stats'],
    queryFn: async () => {
      const { data } = await api.get('/contingency/stats');
      return data.data;
    },
    refetchInterval: 30000,
  });
}

export function useContingency(id) {
  return useQuery({
    queryKey: ['contingency', id],
    queryFn: async () => {
      const { data } = await api.get(`/contingency/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

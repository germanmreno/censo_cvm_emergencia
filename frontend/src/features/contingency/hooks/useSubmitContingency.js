import { useMutation } from '@tanstack/react-query';
import { api } from '../../../lib/api';

export function useSubmitContingency() {
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/contingency', payload);
      return data;
    },
  });
}

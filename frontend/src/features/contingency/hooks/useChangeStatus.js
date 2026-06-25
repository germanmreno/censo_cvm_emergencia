import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../lib/api';

export function useChangeStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, note }) => {
      const { data } = await api.patch(`/contingency/${id}/status`, { status, note });
      return data.data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['contingency', 'list'] });
      qc.invalidateQueries({ queryKey: ['contingency', 'stats'] });
      qc.invalidateQueries({ queryKey: ['contingency', vars.id] });
    },
  });
}

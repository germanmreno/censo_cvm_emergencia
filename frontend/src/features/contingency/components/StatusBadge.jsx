import { statusLabel } from '../../../lib/schemas/contingency';
import { Badge } from '../../../components/ui/Badge';

const variantMap = {
  RECEIVED: 'info',
  IN_PROCESS: 'warning',
  ATTENDED: 'primary',
  CLOSED: 'default',
};

export function StatusBadge({ status }) {
  return <Badge variant={variantMap[status] ?? 'default'}>{statusLabel[status] ?? status}</Badge>;
}

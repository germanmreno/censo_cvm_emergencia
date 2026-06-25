import { Router } from 'express';
import {
  postContingency,
  getContingencyList,
  getContingencyOne,
  patchContingencyStatus,
  getContingencyStats,
  exportCsv,
  exportXlsx,
} from './contingency.controller.js';
import { publicLimiter } from '../../middlewares/rateLimit.js';
import { authOptional, requireAuth, requireRole } from '../../middlewares/auth.js';

const router = Router();

router.use(authOptional);

router.post('/', publicLimiter, postContingency);
router.get('/stats', requireAuth, requireRole('ADMIN', 'OPERATOR'), getContingencyStats);
router.get('/export.csv', requireAuth, requireRole('ADMIN'), exportCsv);
router.get('/export.xlsx', requireAuth, requireRole('ADMIN'), exportXlsx);
router.get('/', requireAuth, requireRole('ADMIN', 'OPERATOR'), getContingencyList);
router.get('/:id', requireAuth, requireRole('ADMIN', 'OPERATOR'), getContingencyOne);
router.patch('/:id/status', requireAuth, requireRole('ADMIN', 'OPERATOR'), patchContingencyStatus);

export default router;

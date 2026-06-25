import { Router } from 'express';
import { postLogin, postRefresh, getMe } from './auth.controller.js';
import { loginLimiter } from '../../middlewares/rateLimit.js';
import { authOptional, requireAuth } from '../../middlewares/auth.js';

const router = Router();

router.use(authOptional);

router.post('/login', loginLimiter, postLogin);
router.post('/refresh', postRefresh);
router.get('/me', requireAuth, getMe);

export default router;

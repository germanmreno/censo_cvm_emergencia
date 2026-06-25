import { loginSchema } from './auth.schema.js';
import { login, refresh, me } from './auth.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const postLogin = asyncHandler(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const result = await login({ email, password });
  res.json({ data: result });
});

export const postRefresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body ?? {};
  const result = await refresh(refreshToken);
  res.json({ data: result });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await me(req.user.id);
  res.json({ data: user });
});

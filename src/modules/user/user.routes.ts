import { Router } from 'express';
import { getProfile, getAllUsers, toggleUserStatus } from './user.controller';
import { authenticate, authorize } from '../../middlewares/auth';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.get('/', authorize('admin'), getAllUsers);
router.patch('/toggle-status/:userId', authorize('admin'), toggleUserStatus);

export default router;
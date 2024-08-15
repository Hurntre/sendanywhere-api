import { Router } from 'express';
import UserController from '../controllers/user';
import { auth } from '../middleware';

const router = Router();

router.get('/me', auth, UserController.profile);

export default router;

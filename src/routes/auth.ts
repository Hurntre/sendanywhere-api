import { Router } from 'express';
import authController from '../controllers/auth';
import { signupValidator } from '../validators';

const router = Router();

router.post('/signup', signupValidator, authController.signup);
router.post('/login', authController.login);

export default router;

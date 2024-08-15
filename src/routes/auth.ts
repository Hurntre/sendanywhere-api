import { Router } from 'express';
import authController from '../controllers/auth';
import { signupValidator, loginValidator } from '../validators';

const router = Router();

router.post('/signup', signupValidator, authController.signup);
router.post('/login', loginValidator, authController.login);

export default router;

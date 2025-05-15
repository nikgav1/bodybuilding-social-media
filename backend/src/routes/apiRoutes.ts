import express from 'express';
import { signUp, signIn, validateToken } from '../controllers/authController';

const router: express.Router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/validate-token', validateToken);

export default router;

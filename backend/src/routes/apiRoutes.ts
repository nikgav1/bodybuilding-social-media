import express from 'express';
import { signUp, signIn, validateToken } from '../controllers/authController';
import { authMiddleware } from '../middlewares/auth';
import { uploadPhoto } from '../controllers/dataController';
import { upload } from '../services/uploadPhoto';

const router: express.Router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/validate-token', validateToken);
router.post(
  '/upload-photo',
  authMiddleware,
  upload.single('photo'),
  uploadPhoto
);

export default router;

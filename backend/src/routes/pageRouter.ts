import express from 'express';
import path from 'path';

const router: express.Router = express.Router();
const FRONTEND_DIST = path.resolve(__dirname, '../../../frontend/dist/src');

router.get('/', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIST, 'pages/main/index.html'));
});

router.get('/about', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIST, 'pages/about/index.html'));
});

router.get('/spa', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIST, 'spa/index.html'));
});

export default router;

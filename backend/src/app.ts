import express from 'express';
import path from 'path';
import { config } from './config/env';
import connectDB from './config/db';
import pageRouter from './routes/pageRouter';
import apiRouter from './routes/apiRoutes';

const app = express();
const FRONTEND_DIST = path.resolve(__dirname, '../../frontend/dist');

app.use(express.json());

connectDB()
  .then(() => {
    app.use(express.static(FRONTEND_DIST));

    app.use('/', pageRouter);
    app.use('/api', apiRouter);

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })
  .catch(error => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });

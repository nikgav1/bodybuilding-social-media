import express from 'express';
import path from 'path';
import setUp from './config/setUp';
import pageRouter from './routes/pageRouter';
import apiRouter from './routes/apiRoutes';

const app: express.Application = express();
const FRONTEND_DIST: string = path.resolve(__dirname, '../../frontend/dist');

app.use(express.json());

setUp()
  .then(() => {
    app.use(express.static(FRONTEND_DIST));

    app.use('/', pageRouter);
    app.use('/api', apiRouter);

    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
  });

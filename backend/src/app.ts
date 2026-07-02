import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import apiRouter from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Application factory.
export function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'gscores-backend' });
  });

  app.use('/api', apiRouter);

  // 404 + centralised error handling (must be last)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import apiRouter from './routes';
import { prisma } from './lib/prisma';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Application factory.
export function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health check that also verifies database connectivity, so a monitor
  // (or reviewer) gets a truthful signal instead of "ok" while the DB is down.
  app.get('/api/health', async (_req: Request, res: Response) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.json({ status: 'ok', service: 'gscores-backend', db: 'up' });
    } catch {
      res
        .status(503)
        .json({ status: 'error', service: 'gscores-backend', db: 'down' });
    }
  });

  app.use('/api', apiRouter);

  // 404 + centralised error handling (must be last)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

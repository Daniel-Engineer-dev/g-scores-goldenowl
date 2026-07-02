import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/report.service';

export async function getStatistics(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const report = await reportService.getStatistics();
    res.json(report);
  } catch (err) {
    next(err);
  }
}

export async function getTopGroupA(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const students = await reportService.getTopGroupA(10);
    res.json(students);
  } catch (err) {
    next(err);
  }
}

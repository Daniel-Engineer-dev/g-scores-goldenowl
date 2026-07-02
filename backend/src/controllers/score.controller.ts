import { Request, Response, NextFunction } from 'express';
import { scoreService } from '../services/score.service';
import { validateSbd } from '../validators/sbd.validator';

export async function getScoreBySbd(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const sbd = validateSbd(req.params.sbd);
    const result = await scoreService.getScoreBySbd(sbd);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

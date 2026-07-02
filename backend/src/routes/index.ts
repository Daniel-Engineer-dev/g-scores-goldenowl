import { Router } from 'express';
import { getScoreBySbd } from '../controllers/score.controller';
import { getStatistics, getTopGroupA } from '../controllers/report.controller';

const router = Router();

// Score lookup by registration number
router.get('/scores/:sbd', getScoreBySbd);

// Reports
router.get('/reports/statistics', getStatistics);
router.get('/reports/top-group-a', getTopGroupA);

export default router;

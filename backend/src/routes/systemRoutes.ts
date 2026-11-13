import { Router } from 'express';
import { getSystemTime, getHealth, getPublicConfig, createPublicTicket } from '../controllers/systemController';

const router = Router();

router.get('/time', getSystemTime);
router.get('/health', getHealth);
router.get('/config', getPublicConfig);
router.post('/tickets', createPublicTicket);

export const systemRoutes = router;

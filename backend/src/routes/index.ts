import { Router } from 'express';
import { playerRoutes } from './playerRoutes';
import { dailyChallengeRoutes } from './dailyChallengeRoutes';
import { levelRoutes } from './levelRoutes';
import { systemRoutes } from './systemRoutes';
import { adminRoutes } from './adminRoutes';

const router = Router();

router.use('/players', playerRoutes);
router.use('/daily', dailyChallengeRoutes);
router.use('/levels', levelRoutes);
router.use('/system', systemRoutes);
router.use('/admin', adminRoutes);

export const apiRouter = router;

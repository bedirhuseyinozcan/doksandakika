import { Router } from 'express';
import { requireAdminAuth } from '../middlewares/adminAuth';
import {
  getAdminOverview,
  getAdminConfig,
  updateAdminConfig,
  getAdminTickets,
  updateAdminTicket,
  deleteAdminTicket,
  getAdminPlayers,
  upsertAdminPlayer,
  updateAdminPlayer,
  deleteAdminPlayer,
  getAdminDailyChallenges,
  upsertAdminDailyChallenge,
  deleteAdminDailyChallenge,
  getAdminLevels,
  upsertAdminLevel,
  deleteAdminLevel,
} from '../controllers/adminController';

const router = Router();

// All /api/v1/admin/* routes require Kora Admin API Key
router.use(requireAdminAuth);

// 1. Overview & Telemetry
router.get('/overview', getAdminOverview);

// 2. Remote Config (Maintenance Mode & Broadcasts)
router.get('/config', getAdminConfig);
router.put('/config', updateAdminConfig);

// 3. Support Tickets
router.get('/tickets', getAdminTickets);
router.patch('/tickets/:id', updateAdminTicket);
router.delete('/tickets/:id', deleteAdminTicket);

// 4. Players CRUD
router.get('/players', getAdminPlayers);
router.post('/players', upsertAdminPlayer);
router.patch('/players/:playerId', updateAdminPlayer);
router.delete('/players/:playerId', deleteAdminPlayer);

// 5. Daily Challenges CRUD
router.get('/daily', getAdminDailyChallenges);
router.post('/daily', upsertAdminDailyChallenge);
router.delete('/daily/:id', deleteAdminDailyChallenge);

// 6. Levels CRUD
router.get('/levels', getAdminLevels);
router.post('/levels', upsertAdminLevel);
router.delete('/levels/:id', deleteAdminLevel);

export const adminRoutes = router;

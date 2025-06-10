import express from 'express';
import { protect } from '../middlewares/authMiddlewares.js';
import { requestSession,getReceivedSession,respondToSession, getSessionBetweenUsers, getAcceptedSessions} from '../controllers/sessionController.js';
import { getSessionById } from '../controllers/sessionController.js';
import { markSessionCompleted, getUserStats } from '../controllers/sessionController.js';

const router = express.Router();

// More specific routes first
router.get('/received', protect, getReceivedSession);
router.get('/accepted', protect, getAcceptedSessions);
router.get('/between/:recipientId', protect, getSessionBetweenUsers);
router.get('/:id', protect, getSessionById); // <-- This must come LAST

router.post('/request', protect, requestSession);
router.put('/:id/respond', protect, respondToSession);

router.put('/:id/complete', protect, markSessionCompleted);
router.get('/stats/me', protect, getUserStats);


export default router;

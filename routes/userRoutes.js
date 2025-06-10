import express from 'express';
import { getSkillMatches,wantToLearnProfile } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddlewares.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/match', protect, getSkillMatches);
router.get('/match/learnonly',protect,wantToLearnProfile);

router.get('/users/all', protect, async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});


export default router;

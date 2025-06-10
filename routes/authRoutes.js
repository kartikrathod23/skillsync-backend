import express from 'express'
import { register,login } from '../controllers/authController.js'
import { protect } from '../middlewares/authMiddlewares.js';
import User from '../models/User.js';

const router = express.Router()

router.post('/register',register);
router.post('/login',login);

router.get('/me',protect,async(req,res)=>{
    res.json(req.user);
})

router.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});


export default router
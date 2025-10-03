import express from 'express';
import auth from '../middlewares/auth.middlewares.js';
import User from '../models/user.model.js';
const router = express.Router();

router.get('/me', auth, async (req,res,next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
});

router.put('/me', auth, async (req,res,next) => {
  try {
    const { name, bio } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, bio }, { new: true }).select('-passwordHash');
    res.json(user);
  } catch (err) { next(err); }
});

export default router;

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/user.model.js';

const router = express.Router();

router.post('/register',
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req,res,next) => {
    try {
      const errors = validationResult(req); 
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { name, email, password } = req.body;
      if (await User.findOne({ email })) return res.status(400).json({ error: 'Email exists' });
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, passwordHash });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) { next(err); }
  });

router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req,res,next) => {
    try {
      console.log('Login request body:', req.body); // Debug log
      const errors = validationResult(req); 
      if (!errors.isEmpty()) {
        console.log('Login validation errors:', errors.array()); // Debug log
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: 'Invalid credentials' });
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) { next(err); }
  });

export default router;

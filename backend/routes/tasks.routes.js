import express from 'express';
import auth from '../middlewares/auth.middlewares.js';
import Task from '../models/task.model.js';
const router = express.Router();

// list with optional search q
router.get('/', auth, async (req,res,next) => {
  try {
    const q = req.query.q ? { title: new RegExp(req.query.q, 'i') } : {};
    const statusFilter = req.query.status ? { status: req.query.status } : {};
    const tasks = await Task.find({ owner: req.user.id, ...q, ...statusFilter }).sort('-createdAt');
    res.json(tasks);
  } catch (err) { next(err); }
});

// get single
router.get('/:id', auth, async (req,res,next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Not found' });
    if (task.owner.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    res.json(task);
  } catch (err) { next(err); }
});

// create
router.post('/', auth, async (req,res,next) => {
  try {
    const task = await Task.create({ ...req.body, owner: req.user.id });
    res.status(201).json(task);
  } catch (err) { next(err); }
});

// update
router.put('/:id', auth, async (req,res,next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Not found' });
    if (task.owner.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (err) { next(err); }
});

// delete
router.delete('/:id', auth, async (req,res,next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Not found' });
    if (task.owner.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    await task.remove();
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;

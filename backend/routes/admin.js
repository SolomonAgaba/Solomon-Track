const express = require('express');
const { User, Activity, Stage } = require('../models');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// suspend or unsuspend user
router.post('/users/:id/suspend', authenticateToken, requireAdmin, async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.suspended = !!req.body.suspended;
  await user.save();
  res.json({ ok: true, suspended: user.suspended });
});

// create activity with stages
router.post('/activities', authenticateToken, requireAdmin, async (req, res) => {
  const { title, slug, type, target, target_unit, description, stages = [], validationTrigger } = req.body;
  if (!title || !slug || !type) return res.status(400).json({ error: 'Missing required fields' });
  const activity = await Activity.create({ title, slug, type, target, target_unit, description });
  for (let i = 0; i < stages.length; i++) {
    await Stage.create({ name: stages[i], order: i + 1, ActivityId: activity.id });
  }
  activity.validationTrigger = validationTrigger || null;
  res.json({ ok: true, activity });
});

// assign user to activity
router.post('/activities/:id/assign', authenticateToken, requireAdmin, async (req, res) => {
  const activity = await Activity.findByPk(req.params.id);
  if (!activity) return res.status(404).json({ error: 'Activity not found' });
  const { userId } = req.body;
  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  await activity.addAssignedUser(user);
  res.json({ ok: true });
});

module.exports = router;

const express = require('express');
const { Activity, Stage, User, DashboardEntry } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// get activities assigned to the current user (for user dashboard)
router.get('/my', authenticateToken, async (req, res) => {
  const user = await User.findByPk(req.user.id, { include: [{ model: Activity, as: 'assignedActivities', include: ['stages'] }] });
  res.json({ activities: user.assignedActivities });
});

// push an entry to dashboard for activity (user reports progress) - only admin can validate later
router.post('/:id/entries', authenticateToken, async (req, res) => {
  const activity = await Activity.findByPk(req.params.id);
  if (!activity) return res.status(404).json({ error: 'Activity not found' });
  // only assigned users or admin may push entries
  const assigned = await activity.getAssignedUsers({ where: { id: req.user.id } });
  const isAssigned = assigned && assigned.length > 0;
  if (!isAssigned && req.user.role !== 'admin') return res.status(403).json({ error: 'Not assigned to this activity' });

  const { value, percentage, stageAt, details, completedStages } = req.body;
  const entry = await DashboardEntry.create({ value: value || null, percentage: percentage || null, stageAt: stageAt || null, details: details || null, completedStages: completedStages ? JSON.stringify(completedStages) : null, ActivityId: activity.id, createdById: req.user.id });
  res.json({ ok: true, entry });
});

// update an existing entry (only owner or admin)
router.patch('/entries/:entryId', authenticateToken, async (req, res) => {
  const entry = await DashboardEntry.findByPk(req.params.entryId);
  if (!entry) return res.status(404).json({ error: 'Entry not found' });
  if (entry.createdById !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Not allowed to edit this entry' });
  const { details, completedStages, stageAt, percentage, value } = req.body;
  if (details !== undefined) entry.details = details;
  if (completedStages !== undefined) entry.completedStages = JSON.stringify(completedStages);
  if (stageAt !== undefined) entry.stageAt = stageAt;
  if (percentage !== undefined) entry.percentage = percentage;
  if (value !== undefined) entry.value = value;
  await entry.save();
  res.json({ ok: true, entry });
});

module.exports = router;

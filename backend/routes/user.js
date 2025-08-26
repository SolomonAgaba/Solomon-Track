const express = require('express');
const { User, Activity, Assignment, DashboardEntry, Stage } = require('../models');
const router = express.Router();

// Middleware to check user
function isUser(req, res, next) {
  if (req.user && req.user.role === 'user') return next();
  return res.status(403).json({ error: 'User only' });
}

// Get assigned activities for user
router.get('/activities', isUser, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  const activities = await user.getAssignedActivities({ include: [Stage] });
  res.json(activities);
});

// Get dashboard entries for user
router.get('/dashboard', isUser, async (req, res) => {
  const entries = await DashboardEntry.findAll({ where: { UserId: req.user.id } });
  res.json(entries);
});

module.exports = router;

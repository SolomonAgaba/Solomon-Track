const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const envFile = process.env.DATABASE_FILE || './database.sqlite';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve(__dirname, '..', envFile),
  logging: false,
});

const User = sequelize.define('User', {
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'user'), allowNull: false, defaultValue: 'user' },
  suspended: { type: DataTypes.BOOLEAN, defaultValue: false },
});

const Activity = sequelize.define('Activity', {
  title: { type: DataTypes.STRING, allowNull: false },
  slug: { type: DataTypes.STRING, allowNull: false, unique: true },
  type: { type: DataTypes.ENUM('dynamic', 'fixed'), allowNull: false },
  target: { type: DataTypes.STRING },
  target_unit: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT }
});

const Stage = sequelize.define('Stage', {
  name: { type: DataTypes.STRING, allowNull: false },
  order: { type: DataTypes.INTEGER, defaultValue: 0 }
});

const Assignment = sequelize.define('Assignment', {
  // links user to activity
});

const DashboardEntry = sequelize.define('DashboardEntry', {
  value: { type: DataTypes.FLOAT },
  percentage: { type: DataTypes.FLOAT },
  stageAt: { type: DataTypes.STRING },
  validated: { type: DataTypes.BOOLEAN, defaultValue: false }
  ,details: { type: DataTypes.TEXT },
  completedStages: { type: DataTypes.TEXT }
});

// Associations
Activity.hasMany(Stage, { as: 'stages', onDelete: 'CASCADE' });
Stage.belongsTo(Activity);

User.belongsToMany(Activity, { through: Assignment, as: 'assignedActivities' });
Activity.belongsToMany(User, { through: Assignment, as: 'assignedUsers' });

Activity.hasMany(DashboardEntry, { as: 'entries' });
DashboardEntry.belongsTo(Activity);
DashboardEntry.belongsTo(User, { as: 'createdBy' });

module.exports = { sequelize, User, Activity, Stage, Assignment, DashboardEntry };

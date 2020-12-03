const { db } = require('../config');

const env = process.env.NODE_ENV || 'development';
exports[env] = Object.assign(db, {
  logging: true,
  migrationStorageTableName: 'sequelize_migrations'
});

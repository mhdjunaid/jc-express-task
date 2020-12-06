const database = require('../../database/models/index');

module.exports = async () => {
  // close the database connection 
  await database.sequelize.close();
};

const { initialize, models } = require('../../database/models/index');

module.exports = async () => {
  // connect to the database and clear all previous data
  await initialize({
    force: true
  });
  // Create a test user for further auth
  await models.User.create({
    email: 'test@jc.com',
    last_name: 'test1',
    first_name: 'test2',
    password: 'test1234'
  });
};

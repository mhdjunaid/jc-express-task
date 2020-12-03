'use strict';

module.exports = {
  up : function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [{
      first_name : 'Piotr',
      last_name : 'Kilosky',
      password : '$2b$10$cqgAWvLJTtIBeHalDJ/ureOlTOrj/29qMfffkazHO3I8i2mvL2MuC',
      created_at : new Date(),
      updated_at : new Date(),
      email : 'test@jc.com'
    }], {});
  },

  down : function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', [{
      email :'test@jc.com'
    }])
  }
};

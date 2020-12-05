module.exports = {
  up: (queryInterface,Sequelize) => queryInterface.bulkInsert('offices', [{
    name: 'National DTowers',
    number: 'DTN221',
    tower_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  },{
    name: 'Legacy DTowers',
    number: 'LTN223',
    tower_id: 1,
    created_at: new Date(),
    updated_at: new Date()
  }]),
  down: () => {}
};

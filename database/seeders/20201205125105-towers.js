module.exports = {
  up: (queryInterface,Sequelize) => queryInterface.bulkInsert('towers', [{
    name: 'Dublin Tower',
    location: 'Dublin',
    coordinates :  Sequelize.fn('ST_GeomFromText', 'POINT(53.3498 6.2603)'),
    rate: 5,
    floors: 2,
    office_count: 2,
    created_at: new Date(),
    updated_at: new Date()
  },{
    name: 'London Tower',
    location: 'London',
    coordinates :  Sequelize.fn('ST_GeomFromText', 'POINT(51.5074 26.904740)'),
    rate: 4,
    floors: 100,
    office_count: 0,
    created_at: new Date(),
    updated_at: new Date()
  }]),
  down: () => {}
};

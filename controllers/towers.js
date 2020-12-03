const { models } = require('../database/models');

const ctrlTowers = {
  async createTower({
    name, rate, lat, long
  }) {
    return models.Tower.createTower({
      name, rate, lat, long
    });
  }
};

module.exports = ctrlTowers;

const { models } = require('../database/models');

const ctrlOffices = {
  async createOffice({
    name, number, towerId
  }) {
    return models.Office.createOffice({
      name, number, towerId
    });
  }
};

module.exports = ctrlOffices;

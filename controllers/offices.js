const { models } = require('../database/models');

const ctrlOffices = {
  async createOffice({
    name, number, towerId
  }) {
    return models.Office.createOffice({
      name, number, towerId
    });
  },
  async removeOffice({
    officeId
  }) {
    return models.Office.removeOffice({
      officeId
    });
  },
  async editOffice({
    office, name, number, towerId
  }) {
    return office.editOffice({
      name,
      number,
      towerId
    });
  },
  async getOffice(officeId) {
    return await models.Office.findOne({
      where: {
        id: officeId
      }
    });
  }
};

module.exports = ctrlOffices;

const { Model } = require('sequelize');
const { models } = require('../../database/models');

/**
 * After office update
 * @param {Model} office 
 * @param {Object} options 
 */
const updateOffice = async (office, options) => {
  const tower = await office.getTower();
  if (tower) {
    tower.officeCount += 1; // increment total offices
    await models.Tower.update({
      officeCount: tower.officeCount
    }, {
      where: {
        id: tower.id
      },
      transaction: options.transaction
    });
  }
  return office;
};
/**
 * After office deletion
 * @param {Model} office 
 * @param {Object} options 
 */
const afterDestroy = async (office, options) => {
  const tower = await office.getTower();
  if (tower) {
    tower.officeCount -= 1; // decrement total offices
    await models.Tower.update({
      officeCount: tower.officeCount
    }, {
      where: {
        id: tower.id
      },
      transaction: options.transaction
    });
  }
  return office;
};
class Office extends Model {
  static init(sequelize, DataTypes) {
    super.init({
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val) {
          this.setDataValue('name', val.trim());
        },
        validate: {
          notEmpty: true
        }
      },
      number: {
        type: DataTypes.STRING
      }
    }, {
      sequelize,
      hooks: {
        beforeBulkDestroy: function (options) {
          options.individualHooks = true;
          return options;
        },
        afterCreate: updateOffice,
        afterDestroy
      }
    });
  }

  /**
    * Creates a new office 
    * @param {String} Name
    * @param {String} Number
    * @param {Number} TowerId
    */
  static async createOffice({
    name, number, towerId
  }) {
    return Office.create({
      name, number, towerId
    });
  }

  /**
   * Remove an office 
   * @param {Number} officeId
   */
  static async removeOffice({
    officeId
  }) {
    return Office.destroy({
      where: {
        id: officeId
      }
    })
  }

  /**
   * Edit the current office
   * @param {Object} params
   */
  async editOffice({
    name, number, towerId
  }) {
    this.name = name || this.name;
    this.number = number || this.number;
    this.towerId = towerId || this.towerId;
    return this.save();
  }

  /**
   * Associations
   */
  static associate(models) {
    // An office with 1-1 relation with tower
    Office.belongsTo(models.Tower, {
      as: 'tower',
      foreignKey: 'towerId'
    });
  }

}

module.exports = Office;
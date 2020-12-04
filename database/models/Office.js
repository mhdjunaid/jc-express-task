const { Model } = require('sequelize');
const { models } = require('../../database/models');

const afterCreate = async (office, options) => {
  const tower = await office.getTower();
  if (tower) {
    const offices = tower.officeCount + 1;
    await models.Tower.update({
      officeCount: offices
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
        afterCreate // Update office count for the tower
      },
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
   * @ignore
   */
  static associate(models) {
    Office.belongsTo(models.Tower, {
      as: 'tower',
      foreignKey: 'towerId'
    });
  }

}

module.exports = Office;
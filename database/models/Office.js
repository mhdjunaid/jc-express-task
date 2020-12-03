const { Model } = require('sequelize');

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
      sequelize
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
const { Model } = require('sequelize');

class Tower extends Model {
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
      rate: {
        type: DataTypes.SMALLINT
      },
      coordinates: {
        type: DataTypes.GEOMETRY('POINT'),
        allowNull: false
      },
      lat: {
        // Make latitude and longtude as virtual columns
        type: DataTypes.VIRTUAL('DECIMAL', ['coordinates']),
        get() {
          return this.coordinates ? this.coordinates.coordinates[1] : 0;
        },
        set(value) {
          const coordinates = this.getDataValue('coordinates') || {
            type: 'POINT',
            coordinates: [0, 0]
          };
          coordinates.coordinates[1] = value;
          this.setDataValue('coordinates', coordinates);
        }
      },
      long: {
        type: DataTypes.VIRTUAL('DECIMAL', ['coordinates']),
        get() {
          return this.coordinates ? this.coordinates.coordinates[0] : 0;
        },
        set(value) {
          const coordinates = this.getDataValue('coordinates') || {
            type: 'POINT',
            coordinates: [0, 0]
          };
          coordinates.coordinates[0] = value;
          this.setDataValue('coordinates', coordinates);
        }
      },
      floors: {
        type: DataTypes.INTEGER,
        default: 1 // Default total floors to 1
      },
      officeCount: {
        type: DataTypes.INTEGER,
        default: 0 // Default no of offices to zero
      }
    }, {
      sequelize
    });
  }

  /**
   * Creates a new tower 
   * @param {String} Name
   * @param {Integer} Rate
   * @param {Geometry} Lat
   * @param {Geometry} Long
   */
  static async createTower({
    name, rate, lat, long, floors
  }) {
    return Tower.create({
      name, rate, lat, long, floors, officeCount:0 
    });
  }

  /**
   * List towers based on the query params
   * @param {Object} options
   * @param {Object} where
   */
  static async listTowers({
    options
  }) {
    return await Tower.findAll({
      offset: options.offset || 0,
      limit: options.limit || 10,
      where: options.where || {},
      order: options.order || []
    })
  }

  /**
   * Associations for the Tower model
   * @param {*} models 
   */
  static associate(models) {
    Tower.hasMany(models.Office, {
      as: 'offices',
      foreignKey: 'towerId'
    });
  }

}

module.exports = Tower;
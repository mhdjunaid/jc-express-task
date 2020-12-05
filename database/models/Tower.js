const { Model } = require('sequelize');
const { io } = require('../../lib/socket');

const afterCreate = async (tower) => {
  // Emit to clients with tower info
  io.emit('tower', {
    status: 'created',
    towerId: tower.id,
    location: tower.location
  });
  return tower;
};

const afterDestroy = async (tower) => {
  // Emit to clients with tower info after deleted
  io.emit('tower', {
    status: 'removed',
    location: tower.location
  });
  return tower;
};

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
      location: {
        type: DataTypes.STRING
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
      sequelize,
      hooks: {
        afterCreate, // Notify clients - socket
        afterDestroy
      },
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
    name, rate, lat, long, floors, location
  }) {
    return Tower.create({
      name, rate, lat, long, floors, location, officeCount: 0
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
    * Edit the current tower
    * @param {Object} params
    */
  async editTower({
    name, rate, lat, long, floors, location
  }) {
    this.name = name || this.name;
    this.rate = rate || this.rate;
    this.lat = lat || this.lat;
    this.long = long || this.long;
    this.floors = floors || this.floors;
    this.location = location || this.location;
    return this.save();
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
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

const saltRounds = 10;
async function hashPasswordHook(user) {
  user.set('password', await bcrypt.hash(user.password, saltRounds));
}

class User extends Model {
  static init(sequelize, DataTypes) {
    super.init({
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      password: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true
      }
    }, {
      sequelize,
      hooks: {
        // hash passowrd 
        beforeSave: [hashPasswordHook]
      },
    },
    );
  }

  /**
   * Login to the system
   * @param {string} params.email
   * @param {string} params.password
   */
  static async login({ email, password }) {
    const where = {};
    where.email = email;
    const user = await User.findOne({
      where
    });
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      const ret = { user };
      return ret;
    }
  }
}

module.exports = User;
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

   /**
   * Creates a new user 
   * @param {String} email
   * @param {String} password
   * @param {String} firstName
   * @param {String} lastName
   */
  static async createUser({
    email, password, firstName, lastName,
  }) {
    return User.create({
      email, password, first_name: firstName, last_name: lastName
    });
  }
}

module.exports = User;
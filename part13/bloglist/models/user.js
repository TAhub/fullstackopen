const sequelize = require('../utils/db')
const { Model, DataTypes } = require('sequelize')

class User extends Model {
  toJSON() {
    const json = super.toJSON()
    delete json.passwordHash
    return json
  }
}
User.init({
  userName: {
    type: DataTypes.TEXT,
    primaryKey: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  passwordHash: {
    type: DataTypes.TEXT,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user'
})

module.exports = User

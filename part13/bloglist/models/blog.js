const sequelize = require('../utils/db')
const { Model, DataTypes, Deferrable } = require('sequelize')

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  author: {
    type: DataTypes.TEXT,
    allowNull: false
    // TODO: this should be a foreign key
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  user: {
    type: DataTypes.TEXT,
    references: {
      model: sequelize.models.user,
      key: 'user_name',
      deferrable: Deferrable.INITIALLY_DEFERRED,
    },
  },
  // TODO: add comments (how do I have arrays of strings? maybe as a blob?)
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

module.exports = Blog

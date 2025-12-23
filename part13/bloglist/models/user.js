const { Sequelize, Model, DataTypes } = require('sequelize')

const makeModel = (sequelize) => {
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
    // TODO: blogs list? maybe not needed, with joins...
  }, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'user'
  })
  User.sync()
}

module.exports = makeModel

/*
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  passwordHash: String,
  name: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    minLength: 4,
    required: true,
    unique: true,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // Convert _id to id.
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    // Remove __v, which we don't need.
    delete returnedObject.__v
    // The passwordHash is not meant to be revealed to the end-user.
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)
*/
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

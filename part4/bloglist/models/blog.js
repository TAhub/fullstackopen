const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // Fill in likes, if unset.
    if (!returnedObject.likes) {
      returnedObject.likes = 0
    }
    // Convert _id to id.
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    // Remove __v, which we don't need.
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)

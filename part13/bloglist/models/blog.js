const { Sequelize, Model, DataTypes } = require('sequelize')

const makeModel = (sequelize) => {
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
      type: DataTypes.INTEGER
    },
    // TODO: add user (another foreign key?)
    // TODO: add comments (how do I have arrays of strings? maybe as a blob?)
  }, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
  })
  Blog.sync()
}

module.exports = makeModel

/*
const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [String],
})
blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // Fill in likes, if unset.
    if (!returnedObject.likes) {
      returnedObject.likes = 0
    }
    // Fill in comments, if unset.
    if (!returnedObject.comments) {
      returnedObject.comments = []
    }
    // Convert _id to id.
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    // Remove __v, which we don't need.
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)
*/
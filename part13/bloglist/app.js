const config = require('./utils/config')

// Set up the SQL database.
const { Sequelize, QueryTypes } = require('sequelize')
const sequelize = new Sequelize(config.POSTGRES_URL)
// TODO: in retrospect, these individual model files do not seem to be the right way to structure models...
// it is making things inconvenient
require('./models/user')(sequelize).then(() => {
  require('./models/blog')(sequelize)
})

// Make the express router.
const express = require('express')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const app = express()
app.use(express.json())
app.use(middleware.makeModelProvider(sequelize))
app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// Export the app.
module.exports = app

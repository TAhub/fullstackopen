const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

mongoose.connect(config.MONGODB_URI)

const app = express()

app.use(express.json())
app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
if (true) {
  // TODO: Temporary print blogs to command-line:
  const loadFn = async () => {
    const { Sequelize, QueryTypes } = require('sequelize')
    const sequelize = new Sequelize(config.POSTGRES_URL)
    await sequelize.authenticate()
    const blogs = await sequelize.query('SELECT * FROM blogs;', { types: QueryTypes.SELECT })
    console.log(blogs)
    await sequelize.close()
  }
  loadFn()
}

module.exports = app

const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const config = require('../utils/config')

usersRouter.get('/', async (request, response) => {
  // TODO: implement
  /*
  const users = await request.models.User.find({}).populate('blogs', { url: 1, title: 1, author: 1, likes: 1 })
  response.json(users)
  */
})

usersRouter.post('/', async (request, response) => {
  // TODO: implement
  /*
  const { userName, name, password } = request.body
  if (password === undefined) {
    return response.status(400).send({ error: 'missing password' })
  }
  if (password.length < 4) {
    return response.status(400).send({ error: 'password is too short' })
  }
  const passwordHash = await bcrypt.hash(password, config.PASSWORD_HASH_SALT_ROUNDS)
  const user = new request.models.User({ userName, name, passwordHash, blogs: [] })
  try {
    const result = await user.save()
    return response.status(201).json(result)
  } catch (error) {
    if (error.name === 'MongoServerError') {
      response.status(400).json({ error: 'userName is already taken' })
    } else if (error.name === 'ValidationError') {
      if (error.errors.userName !== undefined) {
        if (error.errors.userName.kind === 'minlength') {
          response.status(400).json({ error: 'userName is too short' })
        }
      }
    }
    return response.status(400).json(error)
  }
  */
})

usersRouter.delete('/:id', async (request, response) => {
  // TODO: implement
  /*
  await request.models.User.findByIdAndDelete(request.params.id)
  response.status(204).end()
  */
})

module.exports = usersRouter

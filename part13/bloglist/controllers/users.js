const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const config = require('../utils/config')
const { User } = require('../models')

usersRouter.get('/', async (request, response) => {
  const users = await User.findAll()
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { userName, name, password } = request.body
  if (password === undefined) {
    return response.status(400).send({ error: 'missing password' })
  }
  if (password.length < 4) {
    return response.status(400).send({ error: 'password is too short' })
  }
  const passwordHash = await bcrypt.hash(password, config.PASSWORD_HASH_SALT_ROUNDS)
  try {
    const result = await User.create({ userName, name, passwordHash })
    return response.status(201).json(result)
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
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
})

usersRouter.delete('/:id', async (request, response) => {
  // TODO: implement
  /*
  await User.findByIdAndDelete(request.params.id)
  response.status(204).end()
  */
})

module.exports = usersRouter

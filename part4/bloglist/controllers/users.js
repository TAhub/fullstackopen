const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const config = require('../utils/config')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
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
  const user = new User({ userName, name, passwordHash })
  const result = await user.save()
  response.status(201).json(result)
})

usersRouter.delete('/:id', async (request, response) => {
  await User.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = usersRouter

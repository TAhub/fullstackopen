const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')

loginRouter.post('/', async (request, response) => {
  const { userName, password } = request.body
  const user = await User.findOne({ userName })
  if (user === null) {
    return response.status(401).json({
      error: 'invalid userName or password'
    })
  }
  if (!(await bcrypt.compare(password, user.passwordHash))) {
    return response.status(401).json({
      error: 'invalid userName or password'
    })
  }
  const token = jwt.sign({
    username: user.userName,
    id: user._id
  }, config.TOKEN_SECRET)
  response.status(200).send({ token, userName: user.userName, name: user.name })
})

module.exports = loginRouter

const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const User = require('../models/user')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  next()
}

const userExtractor = async (request, response, next) => {
  try {
    if (request.token) {
      const decodedToken = jwt.verify(request.token, config.TOKEN_SECRET)
      if (decodedToken.id) {
        const user = await User.findById(decodedToken.id)
        if (user) {
          request.user = user
        }
      }
    }
  } catch (error) {}
  next()
}

module.exports = { tokenExtractor, userExtractor }

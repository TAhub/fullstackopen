require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
const PASSWORD_HASH_SALT_ROUNDS = 10
const TOKEN_SECRET = process.env.TOKEN_SECRET

module.exports = { MONGODB_URI, PORT, PASSWORD_HASH_SALT_ROUNDS, TOKEN_SECRET }

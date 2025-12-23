require('dotenv').config()

const PORT = process.env.PORT
const PASSWORD_HASH_SALT_ROUNDS = 10
const TOKEN_SECRET = process.env.TOKEN_SECRET
const POSTGRES_URL = process.env.POSTGRES_URL

module.exports = { PORT, PASSWORD_HASH_SALT_ROUNDS, TOKEN_SECRET, POSTGRES_URL }

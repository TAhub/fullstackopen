const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const jwt = require('jsonwebtoken')

// Connect to database with Mongoose.
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
require('dotenv').config()
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('connected to MongoDB')
}).catch((error) => {
  console.log('error connection to MongoDB:', error.message)
})

// Load the schema and resolvers.
const typeDefs = require('./schema')
const resolvers = require('./resolvers')

// Start Apollo server.
const server = new ApolloServer({
  typeDefs,
  resolvers,
})
startStandaloneServer(server, {
  listen: { port: process.env.PORT },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})

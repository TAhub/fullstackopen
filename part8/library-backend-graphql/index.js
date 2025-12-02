const { GraphQLError } = require('graphql')
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const jwt = require('jsonwebtoken')

// Connect to database with Mongoose.
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
require('dotenv').config()
mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('connected to MongoDB')
}).catch((error) => {
  console.log('error connection to MongoDB:', error.message)
})

const typeDefs = `
  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author]!
    me: User
  }
`

const resolvers = {
  Query: {
    bookCount: async () => (await Book.find({})).length,
    authorCount: async () => (await Author.find({})).length,
    allBooks: async (obj, args) => {
      const criteria = {}
      if (args.author) {
        try {
          const author = await Author.findOne({ name: args.author })
          criteria['author'] = author
        } catch (error) {
          return null
        }
      }
      if (args.genre) {
        criteria['genres'] = { $all: [args.genre] }
      }
      return await Book.find(criteria)
    },
    allAuthors: async () => await Author.find({}),
    me: (obj, args, context) => context.currentUser
  },
  Mutation: {
    addBook: async (obj, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Need authentication', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
      let author = null
      try {
        author = await Author.findOne({ name: args.author })
      } catch (error) {} // Ignore, and just go ahead and make a new author
      if (!author) {
        author = new Author({ name: args.author })
        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.author,
              error
            }
          })
        }
      }
      const book = new Book({ ...args, author })
      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
            error
          }
        })
      }
      return book
    },
    editAuthor: async (obj, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Need authentication', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }
      const authorObj = await Author.findOne({ name: args.name })
      if (!authorObj) {
        return null
      }
      authorObj.born = args.setBornTo
      try {
        await authorObj.save()
      } catch (error) {
        throw new GraphQLError('Updating author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
      return authorObj
    },
    createUser: async (obj, args) => {
      const user = new User({ ...args })
      try {
        return await user.save()
      } catch (error) {
        throw new GraphQLError('Creating user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      }
    },
    login: async (obj, args) => {
      const user = await User.findOne({ username: args.username })
      // TODO: a real application would be storing the password hash, obviously
      if (!user || args.password !== 'password') {
        throw new GraphQLError('Incorrect credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        }) 
      }
      const tokenData = { username: user.username, id: user._id }
      return { value: jwt.sign(tokenData, process.env.JWT_SECRET) }
    }
  },
  Author: {
    bookCount: async (obj) => {
      return (await Book.find({ author: obj })).length
    }
  },
  Book: {
    author: async (obj) => {
      return await Author.findById(obj.author)
    }
  }
}

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

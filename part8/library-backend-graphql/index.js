const { GraphQLError } = require('graphql')
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

// Connect to database with Mongoose.
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
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
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
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
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author]!
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
    allAuthors: async () => (await Author.find({})).pop
  },
  Mutation: {
    addBook: async (obj, args) => {
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
    editAuthor: async (obj, args) => {
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
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})

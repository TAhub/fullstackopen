const jwt = require('jsonwebtoken')
const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Author = require('./models/author')
const User = require('./models/user')
const Book = require('./models/book')

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
    allAuthors: async () => {
      return await Author.find({})
    },
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
      // Get or make the author.
      let author = null
      try {
        author = await Author.findOne({ name: args.author })
      } catch (error) {} // Ignore, and just go ahead and make a new author
      if (!author) {
        author = new Author({ name: args.author, bookCount: 0 })
      }
      // Update the author's book count.
      author.bookCount += 1
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
      // Make the book.
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
      // Notify subscribers and return.
      pubsub.publish('BOOK_ADDED', { bookAdded: book })
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
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
    }
  },
  Book: {
    author: async (obj) => {
      return await Author.findById(obj.author)
    }
  }
}

module.exports = resolvers
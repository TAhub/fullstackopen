const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const { User, Blog } = require('../models')

const checkIfUserIncorrect = (request, blog) => {
  const user = request.user
  if (!user) {
    return {error: 'invalid token', user: null}
  }
  if (blog.user !== user.userName) {
    return {error: 'only you can delete your blogs', user}
  }
  return {error: null, user}
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.findAll()
  response.json(blogs)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  // TODO: implement
  /*
  if (request.body.text === undefined) {
    return response.status(400).send({ error: 'malformatted comment' })
  }
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }
  if (!blog.comments) {
    blog.comments = []
  }
  blog.comments = blog.comments.concat(request.body.text)
  const updatedBlog = await blog.save()
  response.json(updatedBlog)
  */
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  if (request.body.author === undefined || request.body.title === undefined) {
    return response.status(400).send({ error: 'malformatted blog' })
  }
  const user = request.user
  if (!user) {
    return response.status(401).send({ error: 'invalid token' })
  }
  try {
    const result = await Blog.create({
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes,
      user: user.userName,
    })
    response.status(201).json(result)
  } catch (error) {
    console.log('post blog error', error)
    return response.status(400).json(error)
  }
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findByPk(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }
  const {error, user} = checkIfUserIncorrect(request, blog)
  if (error) {
    return response.status(401).send({ error })
  }
  try {
    blog.author = request.body.author
    blog.title = request.body.title
    blog.likes = request.body.likes
    await blog.save()
    response.json(blog)
  } catch (error) {
    console.log('update blog error', error)
    return response.status(400).json(error)
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findByPk(request.params.id)
  if (blog.user === undefined) {
    return response.status(401).send({ error: 'no-one can delete userless blogs. NO-ONE!' })
  }
  const {error, user} = checkIfUserIncorrect(request, blog)
  if (error) {
    return response.status(401).send({ error })
  }
  await blog.destroy()
  response.status(204).end()
})

module.exports = blogsRouter

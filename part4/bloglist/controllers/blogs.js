const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

const checkIfUserIncorrect = (request, blog) => {
  const user = request.user
  if (!user) {
    return {error: 'invalid token', user: null}
  }
  if (blog.user._id.toString() !== user.id.toString()) {
    return {error: 'only you can delete your blogs', user}
  }
  return {error: null, user}
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { userName: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  if (request.body.author === undefined || request.body.title === undefined) {
    return response.status(400).send({ error: 'malformatted blog' })
  }
  const user = request.user
  if (!user) {
    return response.status(401).send({ error: 'invalid token' })
  }
  const blog = new Blog({
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user,
  })
  const result = await blog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  response.status(201).json(result)
})

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }
  const {error, user} = checkIfUserIncorrect(request, blog)
  if (error) {
    return response.status(401).send({ error })
  }
  blog.author = request.body.author
  blog.title = request.body.title
  blog.likes = request.body.likes
  const updatedBlog = await blog.save()
  response.json(updatedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog.user === undefined) {
    return response.status(401).send({ error: 'no-one can delete userless blogs. NO-ONE!' })
  }
  const {error, user} = checkIfUserIncorrect(request, blog)
  if (error) {
    return response.status(401).send({ error })
  }
  const idx = user.blogs.indexOf(blog._id)
  if (idx >= 0) {
    user.blogs = user.blogs.splice(idx)
    await user.save()
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter

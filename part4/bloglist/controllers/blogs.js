const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { userName: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
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

blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).end()
  }
  blog.author = request.body.author
  blog.title = request.body.title
  blog.likes = request.body.likes
  const updatedBlog = await blog.save()
  response.json(updatedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog.user !== undefined) {
    const user = await User.findById(blog.user._id)
    const idx = user.blogs.indexOf(blog._id)
    if (idx >= 0) {
      user.blogs = user.blogs.splice(idx)
      await user.save()
    }
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = blogsRouter

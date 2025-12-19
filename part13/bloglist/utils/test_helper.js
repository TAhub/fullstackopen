const Blog = require('../models/blog')
const User = require('../models/user')

const setupStartingUserAndBlog = async () => {
  // Clear the old values.
  await Blog.deleteMany({})
  await User.deleteMany({})
  // Make a user.
  let initialUser = new User({
    userName: 'userName',
    name: 'name',
    passwordHash: 'passwordHash'
  })
  const savedUser = await initialUser.save()
  // Make a blog.
  let initialBlog = new Blog({
    title: 'On Instinct',
    author: 'Doctor Breen',
    url: "https://fullstackopen.com/",
    likes: 0,
    user: await User.findById(savedUser.id),
  })
  const savedBlog = await initialBlog.save()
  // Re-save the user with the blogs.
  initialUser.blogs = [await Blog.findById(savedBlog.id)]
  await initialUser.save()
  // Return the userId, for reference.
  return savedUser.id
}

module.exports = {
  setupStartingUserAndBlog,
}

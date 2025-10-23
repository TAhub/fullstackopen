const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  let favorite = null
  for (const blog of blogs) {
    if (favorite === null || favorite.likes <= blog.likes) {
      favorite = blog
    }
  }
  return favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  let numBlogsByAuthor = {}
  for (const blog of blogs) {
    if (blog.author in numBlogsByAuthor) {
      numBlogsByAuthor[blog.author] += 1
    } else {
      numBlogsByAuthor[blog.author] = 1
    }
  }
  let bestAuthor = null
  for (const author in numBlogsByAuthor) {
    if (bestAuthor === null || numBlogsByAuthor[author] > numBlogsByAuthor[bestAuthor]) {
      bestAuthor = author
    }
  }
  return {
    author: bestAuthor,
    blogs: numBlogsByAuthor[bestAuthor]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  let numLikesByAuthor = {}
  for (const blog of blogs) {
    if (!(blog.author in numLikesByAuthor)) {
      numLikesByAuthor[blog.author] = 0
    }
    numLikesByAuthor[blog.author] += blog.likes
  }
  let bestAuthor = null
  for (const author in numLikesByAuthor) {
    if (bestAuthor === null || numLikesByAuthor[author] > numLikesByAuthor[bestAuthor]) {
      bestAuthor = author
    }
  }
  return {
    author: bestAuthor,
    likes: numLikesByAuthor[bestAuthor]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}

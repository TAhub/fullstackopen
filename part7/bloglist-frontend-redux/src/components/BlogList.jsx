import { useSelector } from 'react-redux'

import Blog from './Blog'

const BlogList = ({ sortMode }) => {
  const blogs = useSelector(store => store.blogs)

  const sortedBlogs = blogs.toSorted((a, b) => {
    switch (sortMode) {
    case 'title':
      return a.title.localeCompare(b.title)
    case 'author':
      return a.author.localeCompare(b.author)
    case 'likes':
      return a.likes - b.likes
    default:
      return a.id.localeCompare(b.id)
    }
  })

  return (<>
    {sortedBlogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
    )}
  </>)
}

export default BlogList
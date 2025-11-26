import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

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

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (<>
    {sortedBlogs.map(blog => <div style={blogStyle} key={blog.id}><Link to={'/blogs/' + blog.id}>{blog.title} by {blog.author}</Link></div>)}
  </>)
}

export default BlogList
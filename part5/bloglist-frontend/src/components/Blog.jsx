import { useState } from 'react'

const Blog = ({ blog }) => {
  const [expanded, setExpanded] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenExpanded = { display: expanded ? 'none' : '' }
  const showWhenExpanded = { display: expanded ? '' : 'none' }

  return (<div style={blogStyle}>
    <div>{blog.title} {blog.author}
      <button style={hideWhenExpanded} onClick={() => setExpanded(true)}>View</button>
      <button style={showWhenExpanded} onClick={() => setExpanded(false)}>Hide</button>
    </div>
    <div style={showWhenExpanded}>
      <div>{blog.url}</div>
      <div>likes {blog.likes}</div>
      <div>{blog.user.name}</div>
    </div>
  </div>)
}

export default Blog
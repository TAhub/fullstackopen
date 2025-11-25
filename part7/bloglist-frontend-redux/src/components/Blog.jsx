import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { likeBlog, deleteBlog } from '../reducers/blogReducer'

const Blog = ({ blog }) => {
  const [expanded, setExpanded] = useState(false)
  const dispatch = useDispatch()
  const user = useSelector(store => store.user)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenExpanded = { display: expanded ? 'none' : '' }
  const showWhenExpanded = { display: expanded ? '' : 'none' }

  const handleLikeButton = (event) => {
    event.preventDefault()
    dispatch(likeBlog(blog, user.token))
  }
  const handleDeleteButton = (event) => {
    event.preventDefault()
    if (window.confirm('Really delete that blog?')) {
      setExpanded(false)
      dispatch(deleteBlog(blog, user.token))
    }
  }

  return (<div style={blogStyle}>
    <div><div>{blog.title}</div> <div>{blog.author}</div>
      <button style={hideWhenExpanded} onClick={() => setExpanded(true)}>View</button>
      <button style={showWhenExpanded} onClick={() => setExpanded(false)}>Hide</button>
    </div>
    <div style={showWhenExpanded}>
      <div>
        {blog.url}
      </div>
      <div>
        likes {blog.likes}
        <button onClick={handleLikeButton}>Like</button>
      </div>
      <div>
        {blog.user.name}
      </div>
      {user.userName === blog.user.userName ? (<button onClick={handleDeleteButton}>Delete</button>) : null}
    </div>
  </div>)
}

export default Blog
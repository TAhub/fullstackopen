import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { likeBlog, deleteBlog } from '../reducers/blogReducer'

const BlogView = () => {
  const id = useParams().id
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const login = useSelector(store => store.login)
  const blogs = useSelector(store => store.blogs)
  const blog = blogs.find(n => n.id === id)
  if (!blog) {
    return null
  }

  const handleLikeButton = (event) => {
    event.preventDefault()
    dispatch(likeBlog(blog, login.token))
  }
  const handleDeleteButton = (event) => {
    event.preventDefault()
    if (window.confirm('Really delete that blog?')) {
      navigate('/')
      dispatch(deleteBlog(blog, login.token))
    }
  }

  return (<div>
    <div>
      <h2>{blog.title}</h2> <h3>by {blog.author}</h3>
      <div>
        {blog.url}
      </div>
      <div>
        likes {blog.likes}
        <button onClick={handleLikeButton}>Like</button>
      </div>
      <div>
        added by {blog.user.name}
      </div>
      {login.userName === blog.user.userName ? (<button onClick={handleDeleteButton}>Delete</button>) : null}
    </div>
  </div>)
}

export default BlogView
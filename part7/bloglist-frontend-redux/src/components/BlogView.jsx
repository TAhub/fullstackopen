import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'

import { likeBlog, deleteBlog, commentBlog } from '../reducers/blogReducer'

const BlogView = () => {
  const [newComment, setNewComment] = useState('')
  const id = useParams().id
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const login = useSelector(store => store.login)
  const blogs = useSelector(store => store.blogs)
  const blog = blogs.find(n => n.id === id)
  if (!blog) {
    return null
  }
  const comments = blog.comments ?? []

  const handleNewCommentChanged = (event) => {
    setNewComment(event.target.value)
  }
  const handleCommentButton = (event) => {
    event.preventDefault()
    if (newComment.length === 0) {
      return // Don't post anything
    }
    // Start the process of posting the comment. This doesn't have to wait for it to finish.
    dispatch(commentBlog(blog, newComment))
    // Clear the old values.
    setNewComment('')
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
      <h4>Comments</h4>
      <ul>
        {comments.map((comment, i) => <li key={i}>{comment}</li>)}
      </ul>
      <form>
        <input type="text" value={newComment} onChange={handleNewCommentChanged} />
        <button onClick={handleCommentButton}>Post Comment</button>
      </form>
      {login.userName === blog.user.userName ? (<><h4>Manage</h4><button onClick={handleDeleteButton}>Delete</button></>) : null}
    </div>
  </div>)
}

export default BlogView
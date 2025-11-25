import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import BlogList from './components/BlogList'
import NewBlog from './components/NewBlog'
import Login from './components/Login'
import Logout from './components/Logout'
import SortMode from './components/SortMode'
import Notification from './components/Notification'
import loginService from './services/login'
import { initializeBlogs, addNewBlog } from './reducers/blogReducer'
import { showNotification } from './reducers/notificationReducer'

const App = () => {
  const dispatch = useDispatch()
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newBlogVisible, setNewBlogVisible] = useState(false)
  const [sortMode, setSortMode] = useState('title')

  const createNewBlog = async (newBlogTitle, newBlogAuthor, newBlogUrl) => {
    // Hide the add form.
    setNewBlogVisible(false)
    // Then try to create a blog.
    dispatch(addNewBlog(newBlogTitle, newBlogAuthor, newBlogUrl, user.token))
  }
  const handleLoginButton = async (event) => {
    event.preventDefault()
    try {
      const newUser = await loginService.login(loginUsername, loginPassword)
      dispatch(showNotification('Successfully logged in!'))
      setUser(newUser)
      // Also, forget the login username and password.
      setLoginUsername('')
      setLoginPassword('')
    } catch(error) {
      dispatch(showNotification('Failed to log in!', error))
    }
  }
  const handleLogoutButton = (event) => {
    event.preventDefault()
    setUser(null)
    dispatch(showNotification('Successfully logged out!'))
  }
  const handleLoginUsernameChanged = (event) => {
    setLoginUsername(event.target.value)
  }
  const handleLoginPasswordChanged = (event) => {
    setLoginPassword(event.target.value)
  }

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  if (user === null) {
    return (
      <div>
        <Notification />
        <h2>Log in to application</h2>
        <Login onLoginButton={handleLoginButton}
          loginUsername={loginUsername} onLoginUsernameChanged={handleLoginUsernameChanged}
          loginPassword={loginPassword} onLoginPasswordChanged={handleLoginPasswordChanged} />
      </div>
    )
  }

  const sortModes = ['title', 'author', 'likes']

  const hideWhenNewBlogVisible = { display: newBlogVisible ? 'none' : '' }
  const showWhenNewBlogVisible = { display: newBlogVisible ? '' : 'none' }

  return (
    <div>
      <Notification />
      <h2>User Management</h2>
      <Logout user={user} onLogoutButton={handleLogoutButton} />
      <h2>Sort</h2>
      <SortMode sortMode={sortMode} setSortMode={setSortMode} sortModes={sortModes} />
      <h2>Blogs</h2>
      <BlogList user={user} sortMode={sortMode} />
      <button style={hideWhenNewBlogVisible} onClick={() => setNewBlogVisible(true)}>Create New Blog</button>
      <div style={showWhenNewBlogVisible}>
        <h2>New Blog</h2>
        <NewBlog createNewBlog={createNewBlog} />
        <button onClick={() => setNewBlogVisible(false)}>Cancel</button>
      </div>
    </div>
  )
}

export default App
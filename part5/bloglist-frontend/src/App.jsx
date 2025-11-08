import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Login from './components/Login'
import Logout from './components/Logout'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [newBlogTitle, setNewBlogTitle] = useState('')
  const [newBlogAuthor, setNewBlogAuthor] = useState('')
  const [newBlogUrl, setNewBlogUrl] = useState('')
  const [notification, setNotification] = useState(null)
  const [newBlogVisible, setNewBlogVisible] = useState(false)

  const showNotification = (notification) => {
    setNotification(notification)
    setTimeout(() => setNotification(null), 4000)
  }
  const handleCreateBlogButton = async (event) => {
    event.preventDefault()
    try {
      const newBlog = await blogService.post(newBlogTitle, newBlogAuthor, newBlogUrl, user.token)
      showNotification({text: 'Successfully posted a blog!'})
      setBlogs(blogs.concat(newBlog))
      // Also, clear the old values.
      setNewBlogTitle('')
      setNewBlogAuthor('')
      setNewBlogUrl('')
      // Finally, hide the add form.
      setNewBlogVisible(false)
    } catch (error) {
      showNotification({text: 'Failed to post blog!', error})
    }
  }
  const handleNewBlogTitleChanged = (event) => {
    setNewBlogTitle(event.target.value)
  }
  const handleNewBlogAuthorChanged = (event) => {
    setNewBlogAuthor(event.target.value)
  }
  const handleNewBlogUrlChanged = (event) => {
    setNewBlogUrl(event.target.value)
  }
  const handleLoginButton = async (event) => {
    event.preventDefault()
    try {
      const newUser = await loginService.login(loginUsername, loginPassword)
      showNotification({text: 'Successfully logged in!'})
      setUser(newUser)
      // Also, forget the login username and password.
      setLoginUsername('')
      setLoginPassword('')
    } catch(error) {
      showNotification({text: 'Failed to log in!', error})
    }
  }
  const handleLogoutButton = (event) => {
    event.preventDefault()
    setUser(null)
    showNotification({text: 'Successfully logged out!'})
  }
  const handleLoginUsernameChanged = (event) => {
    setLoginUsername(event.target.value)
  }
  const handleLoginPasswordChanged = (event) => {
    setLoginPassword(event.target.value)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  if (user === null) {
    return (
      <div>
        <Notification notification={notification} />
        <h2>Log in to application</h2>
        <Login onLoginButton={handleLoginButton}
            loginUsername={loginUsername} onLoginUsernameChanged={handleLoginUsernameChanged}
            loginPassword={loginPassword} onLoginPasswordChanged={handleLoginPasswordChanged} />
      </div>
    )
  }

  const hideWhenNewBlogVisible = { display: newBlogVisible ? 'none' : '' }
  const showWhenNewBlogVisible = { display: newBlogVisible ? '' : 'none' }

  return (
    <div>
      <Notification notification={notification} />
      <h2>User Management</h2>
      <Logout user={user} onLogoutButton={handleLogoutButton} />
      <h2>Blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      <button style={hideWhenNewBlogVisible} onClick={() => setNewBlogVisible(true)}>Create New Blog</button>
      <div style={showWhenNewBlogVisible}>
        <h2>New Blog</h2>
        <NewBlog
            onCreateBlogButton={handleCreateBlogButton}
            newBlogTitle={newBlogTitle} onNewBlogTitleChanged={handleNewBlogTitleChanged}
            newBlogAuthor={newBlogAuthor} onNewBlogAuthorChanged={handleNewBlogAuthorChanged}
            newBlogUrl={newBlogUrl} onNewBlogUrlChanged={handleNewBlogUrlChanged} />
        <button onClick={() => setNewBlogVisible(false)}>Cancel</button>
      </div>
    </div>
  )
}

export default App
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import NewBlog from './components/NewBlog'
import Login from './components/Login'
import Logout from './components/Logout'
import SortMode from './components/SortMode'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [newBlogVisible, setNewBlogVisible] = useState(false)
  const [sortMode, setSortMode] = useState('title')

  const showNotification = (notification) => {
    setNotification(notification)
    setTimeout(() => setNotification(null), 4000)
  }
  const createNewBlog = async (newBlogTitle, newBlogAuthor, newBlogUrl) => {
    // Hide the add form.
    setNewBlogVisible(false)
    // Then try to create a blog.
    try {
      const newBlog = await blogService.post(newBlogTitle, newBlogAuthor, newBlogUrl, user.token)
      showNotification({text: 'Successfully posted a blog!'})
      setBlogs(blogs.concat(newBlog))
    } catch (error) {
      showNotification({text: 'Failed to post blog!', error})
    }
  }
  const likeBlog = async (blog) => {
    try {
      const newBlog = await blogService.put(blog.title, blog.author, blog.url, blog.likes + 1, blog.id, user.token) // TODO: await and store the result
      showNotification({text: 'Successfully liked the blog!'})
      setBlogs(blogs.map(b => b.id != newBlog.id ? b : newBlog))
    } catch (error) {
      showNotification({text: 'Failed to like blog!', error})
    }
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

  const sortModes = ['title', 'author', 'likes']

  blogs.sort((a, b) => {
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

  const hideWhenNewBlogVisible = { display: newBlogVisible ? 'none' : '' }
  const showWhenNewBlogVisible = { display: newBlogVisible ? '' : 'none' }

  return (
    <div>
      <Notification notification={notification} />
      <h2>User Management</h2>
      <Logout user={user} onLogoutButton={handleLogoutButton} />
      <h2>Sort</h2>
      <SortMode sortMode={sortMode} setSortMode={setSortMode} sortModes={sortModes} />
      <h2>Blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} likeBlog={likeBlog} />
      )}
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
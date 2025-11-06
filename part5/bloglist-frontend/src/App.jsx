import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import Logout from './components/Logout'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])

  const handleLoginButton = async (event) => {
    event.preventDefault()
    try {
      const newUser = await loginService.login(loginUsername, loginPassword)
      console.log('SUCCESSFUL LOGIN!')
      setUser(newUser)
      // Also, forget the login username and password.
      setLoginUsername('')
      setLoginPassword('')
    } catch(error) {
      console.log('FAILED LOGIN!', error)
    }
  }
  const handleLogoutButton = (event) => {
    event.preventDefault()
    setUser(null)
    // TODO: anything else?
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
        <h2>Log in to application</h2>
        <Login onLoginButton={handleLoginButton}
            loginUsername={loginUsername} onLoginUsernameChanged={handleLoginUsernameChanged}
            loginPassword={loginPassword} onLoginPasswordChanged={handleLoginPasswordChanged} />
      </div>
    )
  }

  return (
    <div>
      <h2>user management</h2>
      <Logout user={user} onLogoutButton={handleLogoutButton} />
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
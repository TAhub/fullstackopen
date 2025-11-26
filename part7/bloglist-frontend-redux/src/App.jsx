import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useParams,
} from 'react-router-dom'

import Login from './components/Login'
import Logout from './components/Logout'
import Notification from './components/Notification'
import { initializeBlogs } from './reducers/blogReducer'
import { initializeUsers } from './reducers/userReducer'
import BlogsView from './components/BlogsView'
import UsersView from './components/UsersView'
import BlogView from './components/BlogView'

const App = () => {
  const dispatch = useDispatch()
  const login = useSelector(store => store.login)

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [])

  if (login === null) {
    return (
      <div>
        <Notification />
        <h2>Log in to application</h2>
        <Login />
      </div>
    )
  }

  const padding = {
    padding: 5
  }

  return (
    <Router>
      <div>
        <Link style={padding} to="/">blogs</Link>
        <Link style={padding} to="/users">users</Link>
      </div>
      <Notification />
      <h2>User Management</h2>
      <Logout />

      <Routes>
        <Route path="/" element={<BlogsView />} />
        <Route path="/blogs/:id" element={<BlogView />} />
        <Route path="/users" element={<UsersView />} />
      </Routes>
    </Router>
  )
}

export default App
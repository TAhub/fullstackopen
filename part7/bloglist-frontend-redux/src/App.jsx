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
import BlogsView from './components/BlogsView'
import BlogView from './components/BlogView'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(store => store.user)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  if (user === null) {
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
      </div>
      <Notification />
      <h2>User Management</h2>
      <Logout />

      <Routes>
        <Route path="/" element={<BlogsView />} />
        <Route path="/blogs/:id" element={<BlogView />} />
      </Routes>
    </Router>
  )
}

export default App
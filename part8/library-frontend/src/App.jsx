import { useState, useEffect } from 'react'
import { useApolloClient } from '@apollo/client/react'

import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const showIfToken = token ? {} : { 'display': 'none' }
  const showIfNotToken = token ? { 'display' : 'none' } : {}

  // TODO: It's weird that the course suggests mixing localStorage and state like this,
  // but doesn't fully sync them...
  // I added this, but is it "bad pratice"?
  useEffect(() => {
    const token = localStorage.getItem('fso-books-user-token')
    if (token) {
      setToken(token)
    }
  }, [])

  const logout = (event) => {
    event.preventDefault()
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')} style={showIfToken}>add book</button>
        <button onClick={() => setPage('login')} style={showIfNotToken}>login</button>
        <button onClick={logout} style={showIfToken}>logout</button>
      </div>

      <Authors show={page === 'authors'} showIfToken={showIfToken} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <Login show={page === 'login'} setToken={setToken} />
    </div>
  )
}

export default App

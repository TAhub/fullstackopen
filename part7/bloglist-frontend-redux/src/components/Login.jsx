import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { login } from '../reducers/userReducer'

const Login = () => {
  const dispatch = useDispatch()
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const handleLoginUsernameChanged = (event) => {
    setLoginUsername(event.target.value)
  }
  const handleLoginPasswordChanged = (event) => {
    setLoginPassword(event.target.value)
  }
  const handleLoginButton = async (event) => {
    event.preventDefault()
    try {
      dispatch(login(loginUsername, loginPassword))
      // Also, forget the login username and password.
      setLoginUsername('')
      setLoginPassword('')
    } catch (error) {} // Suppress errors; they are handled in the reducer
  }

  return (<form>
    <div>
      <label>
        username <input type="text" value={loginUsername} onChange={handleLoginUsernameChanged} />
      </label>
    </div>
    <div>
      <label>
        password <input type="text" value={loginPassword} onChange={handleLoginPasswordChanged} />
      </label>
    </div>
    <button onClick={handleLoginButton}>Login</button>
  </form>)
}

export default Login
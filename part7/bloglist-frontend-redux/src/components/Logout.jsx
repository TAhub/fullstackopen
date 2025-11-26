import { useDispatch, useSelector } from 'react-redux'

import { logout } from '../reducers/loginReducer'

const onLogoutButton = () => {
  const dispatch = useDispatch()
  const login = useSelector(store => store.login)

  const handleLogoutButton = (event) => {
    event.preventDefault()
    dispatch(logout())
  }

  return (<div>
    <div>{login.name} is logged in.</div>
    <button onClick={handleLogoutButton}>Log Out</button>
  </div>)
}

export default onLogoutButton
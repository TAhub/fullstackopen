import { useDispatch, useSelector } from 'react-redux'

import { logout } from '../reducers/userReducer'

const onLogoutButton = () => {
  const dispatch = useDispatch()
  const user = useSelector(store => store.user)

  const handleLogoutButton = (event) => {
    event.preventDefault()
    dispatch(logout())
  }

  return (<div>
    <div>{user.name} is logged in.</div>
    <button onClick={handleLogoutButton}>Log Out</button>
  </div>)
}

export default onLogoutButton
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const UsersView = () => {
  const users = useSelector(store => store.users)

  return (<table>
    <thead>
      <tr>
        <th />
        <th>blogs created</th>
      </tr>
    </thead>
    <tbody>
      {users.map(user => <tr key={user.id}>
        <th><Link to={'/users/' + user.id}>{user.name}</Link></th>
        <th>{user.blogs.length}</th>
      </tr>)}
    </tbody>
  </table>)
}

export default UsersView
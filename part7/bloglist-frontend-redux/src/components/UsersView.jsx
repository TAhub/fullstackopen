import { useSelector } from 'react-redux'

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
        <th>{user.name}</th>
        <th>{user.blogs.length}</th>
      </tr>)}
    </tbody>
  </table>)
}

export default UsersView
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'

const UserView = () => {
  const id = useParams().id
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const users = useSelector(store => store.users)
  const user = users.find(n => n.id === id)
  if (!user) {
    return null
  }

  return (<div>
    <div>
      <h2>{user.userName}</h2>
      <div>created blogs</div>
      <ul>
        {user.blogs.map(blog => <li key={blog.id}>
          <Link to={'/blogs/' + blog.id}>{blog.title}</Link>
        </li>)}
      </ul>
    </div>
  </div>)
}

export default UserView
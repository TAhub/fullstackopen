const onLogoutButton = ({ user, onLogoutButton }) => (
  <div>
    <div>{user.name} is logged in.</div>
    <button onClick={onLogoutButton}>Log Out</button>
  </div>
)

export default onLogoutButton
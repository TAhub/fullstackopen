const Login = ({ onLoginButton, loginUsername, onLoginUsernameChanged, loginPassword, onLoginPasswordChanged }) => (
  <form>
    <div>
      username <input value={loginUsername} onChange={onLoginUsernameChanged} />
    </div>
    <div>
      password <input value={loginPassword} onChange={onLoginPasswordChanged} />
    </div>
    <button onClick={onLoginButton}>Login</button>
  </form>
)

export default Login
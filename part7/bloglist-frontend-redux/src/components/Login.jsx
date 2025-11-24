const Login = ({ onLoginButton, loginUsername, onLoginUsernameChanged, loginPassword, onLoginPasswordChanged }) => (
  <form>
    <div>
      <label>
        username <input type="text" value={loginUsername} onChange={onLoginUsernameChanged} />
      </label>
    </div>
    <div>
      <label>
        password <input type="text" value={loginPassword} onChange={onLoginPasswordChanged} />
      </label>
    </div>
    <button onClick={onLoginButton}>Login</button>
  </form>
)

export default Login
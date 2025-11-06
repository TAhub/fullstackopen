import axios from 'axios'
const baseUrl = '/api/login'

const login = (username, password) => {
  const request = axios.post(baseUrl, {
    userName: username,
    password,
  })
  return request.then(response => response.data)
}

export default { login }
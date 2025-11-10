import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const post = (title, author, url, token) => {
  const headers = {
    'Authorization': `Bearer ${token}`
  }
  const request = axios.post(baseUrl, {title, author, url, likes: 0}, {headers})
  return request.then(response => response.data)
}

const put = (title, author, url, likes, id, token) => {
  const headers = {
    'Authorization': `Bearer ${token}`
  }
  const request = axios.put(baseUrl + '/' + id, {title, author, url, likes}, {headers})
  return request.then(response => response.data)
}

export default { getAll, post, put }
import axios from 'axios'
// interface for a dog object to be saved or updated to the database
interface Dog {
  name: string,
  likes: number,
  dislikes: number,
  url: string
}

const baseUrl = 'http://localhost:8080/api/dogs'

// endpoints for GET, POST and PUT requests to the backend
const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = (newObject: Dog) => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id: string, newObject: Dog) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update }
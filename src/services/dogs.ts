import axios from 'axios'

interface Dog {
//  name: string,
  likes: number,
  dislikes: number
}

const baseUrl = 'http://localhost:8080/api/dogs'

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
import axios from 'axios'
import { history, getToken, clearToken } from './index'
const http = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0',
  timeout: 5000,
})
http.interceptors.request.use(
  (config) => {
    console.log('config in request', config)
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.log('request error ', error)
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  (response) => {
    console.log('http response ', response)
    return response
  },
  (error) => {
    // console.log('response error ', error)
    console.dir(error)
    /*     if (error.response.status === 401) {
      // token expires
      clearToken()
      history.push('/login')
    } */
    return Promise.reject(error)
  }
)
export { http }

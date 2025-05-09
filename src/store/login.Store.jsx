import { makeAutoObservable } from 'mobx'
import { http, getToken, setToken, clearToken } from '../utils'
class LoginStore {
  token = getToken() || ''
  constructor() {
    makeAutoObservable(this)
  }
  login = async ({ mobile, code }) => {
    const res = await http.post('http://geek.itheima.net/v1_0/authorizations', {
      mobile,
      code,
    })
    //console.log('login res', res)
    //TODO: need to check if the response is successful
    this.token = res.data.data.token
    setToken(this.token)
  }
  logout = () => {
    //console.log('logout')
    this.token = ''
    clearToken()
  }
  cancel = () => {
    console.log('cancel')
  }
}
export default LoginStore

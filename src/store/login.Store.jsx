import { makeAutoObservable } from 'mobx'
import { http } from '../utils'
class LoginStore {
  token = ''
  constructor() {
    makeAutoObservable(this)
  }
  login = async ({ mobile, code }) => {
    const res = await http.post('http://geek.itheima.net/v1_0/authorizations', {
      mobile,
      code,
    })
    console.log('login res', res)
    this.token = res.data.data.token
  }
}
export default LoginStore

import { makeAutoObservable, runInAction } from 'mobx'
import { http } from '../utils'
class UserStore {
  userInfo = {}
  constructor() {
    makeAutoObservable(this)
  }
  async getUserInfo() {
    const res = await http.get('/user/profile')
    //console.log('userinfo res name', res.data.data.name)
    /**
     *userStore.jsx?t=1746499438290:11 [MobX] Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed. Tried to modify: UserStore@2.userInfo 

     * makeAutoObservable:
它会自动将类中的方法标记为 action，并将属性标记为 observable。
如果您使用了 makeAutoObservable，通常不需要手动标记 action。

runInAction:

当您在异步方法中修改 observable 值时，MobX 要求您使用 runInAction 包裹状态修改逻辑。
这是因为异步操作可能在不同的执行上下文中运行，MobX 需要明确知道哪些代码是用于修改状态的。
     */
    runInAction(() => {
      this.userInfo = res.data.data
    })
  }
}
export default UserStore

import React from "react"
import LoginStore from './login.Store'
import UserStore from './userStore'
import ChannelListStore from './channelListStore'

class RootStore {
    // 组合模块
    constructor() {
        this.loginStore = new LoginStore()
        this.userStore = new UserStore()
        this.channelListStore = new ChannelListStore()
    }
}
// 导入useStore方法供组件使用数据
const StoresContext = React.createContext(new RootStore())
export const useStore = () => React.useContext(StoresContext)
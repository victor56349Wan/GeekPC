import { makeAutoObservable, runInAction } from 'mobx'
import { http } from '../utils'
class ChannelListStore {
  channelList = []
  constructor() {
    makeAutoObservable(this)
  }

  async loadChannelList() {
    const res = await http.get('/channels')
    //console.log('loadChannelList res', res)
    if (res.status === 200) {
      runInAction(() => {
        const { channels } = res.data.data
        this.channelList = channels
      })
    }
  }
}

export default ChannelListStore

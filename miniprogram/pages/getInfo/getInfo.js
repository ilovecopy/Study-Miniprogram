const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const app=getApp()
Page({
  data: {
    nickName:'微信用户',
    avatarUrl:defaultAvatarUrl
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  },
  getnickName(event) {
    console.log('获取用户的昵称', event.detail.value)
    this.setData({
      nickName: event.detail.value
    })
    app.globalData.nickName=event.detail.value
  },
})
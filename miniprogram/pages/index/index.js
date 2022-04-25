const app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({
  data: {
    nickName: '微信用户',
    avatarUrl: defaultAvatarUrl,
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  },

  //事件处理函数
  goToTest() {
    wx.navigateTo({
      url: '../test/test'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options", options)
    this.setData({
      nickName: app.globalData.nickName,
      avatarUrl:app.globalData.avatarUrl
    })
  },

  goToDetails() {
    wx.navigateTo({
      url: '../details/details'
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  //微信授权登录
  login() {
    wx.getUserProfile({
      desc: '用于展示排名',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          avatarUrl:res.userInfo.avatarUrl,
          nickName:res.userInfo.nickName,
        })
        app.globalData.userInfo = res.userInfo
        app.globalData.hasUserInfo = true
        app.globalData.avatarUrl=res.userInfo.avatarUrl
        app.globalData.nickName=res.userInfo.nickName
      }
    })
  },

  onShareAppMessage(res) {
    return {
      title: '@你，快来刷题吧~'
    }
  },
})
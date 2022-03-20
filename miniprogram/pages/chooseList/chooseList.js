const app=getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
  },
  onChange(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
  },
  sequence() {
    wx.navigateTo({
      url: '../exam/exam?mode=' + 1,
    })
  },
  random() {
    wx.navigateTo({
      url: '../exam/exam?mode=' + 2,
    })
  },
  //微信授权登录
  login() {
    wx.getUserProfile({
      desc: '用于展示排名',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        app.globalData.userInfo = res.userInfo
        console.log(res.userInfo)
        app.globalData.hasUserInfo = true
        app.globalData.nickName=res.userInfo.nickName
        app.globalData.avatarUrl=res.userInfo.avatarUrl
      }
    })
  }
})
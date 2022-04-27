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
  theory() {
    app.globalData.subject='理论法'
    console.log(app.globalData.subject)
    wx.navigateTo({
      url: '../exam/exam?subject=' + '理论法',
    })
  },
  criminal() {
    app.globalData.subject='刑法'
    console.log(app.globalData.subject)
    wx.navigateTo({
      url: '../exam/exam?subject=' + '刑法',
    })
  },
  country() {
    app.globalData.subject='三国法'
    console.log(app.globalData.subject)
    wx.navigateTo({
      url: '../exam/exam?subject=' + '三国法',
    })
  },
  criminal_procedure() {
    app.globalData.subject='刑诉法'
    console.log(app.globalData.subject)
    wx.navigateTo({
      url: '../exam/exam?subject=' + '刑诉法',
    })
  },
  civil_proceeding() {
    app.globalData.subject='民诉法'
    console.log(app.globalData.subject)
    wx.navigateTo({
      url: '../exam/exam?subject=' + '民诉法',
    })

  },
  commercial() {
    app.globalData.subject='商法'
    console.log(app.globalData.subject)
    wx.navigateTo({
      url: '../exam/exam?subject=' + '商法',
    })

  },
  civil() {
    app.globalData.subject='民法'
    console.log(app.globalData.subject)
    wx.navigateTo({
      url: '../exam/exam?subject=' + '民法',
    })
  },
  economy() {
    app.globalData.subject='经济法'
    console.log(app.globalData.subject)
    wx.navigateTo({
      url: '../exam/exam?subject=' + '经济法',
    })
  },
  administrative() {
    app.globalData.subject='行政法'
    console.log(app.globalData.subject)
    wx.navigateTo({
      url: '../exam/exam?subject=' + '行政法',
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
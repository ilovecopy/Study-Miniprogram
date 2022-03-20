let app=getApp()
Page({
  data: {
    hideEyes: false
  },
  passwordF_B() {
    this.setData({
      hideEyes: !this.data.hideEyes
    })
  },
  formSubmit(e) {
    let {
      password,
      admin
    } = e.detail.value
    if (admin == 1 && password == 1) {
      // app.$util.successToShow("登录成功")
      wx.navigateTo({
        url: '/pages/adminList/adminList',
      })
    } else {
      app.$util.errorToShow("密码或者账号错误")
    }
  }
})
Page({
  data: {
    account: '',
    password: ''
  },
  getAccount(event) {
    console.log('获取用户的账号', event.detail)
    this.setData({
      account: event.detail
    })
  },
  getPassword(event) {
    console.log('获取用户的密码', event.detail)
    this.setData({
      password: event.detail
    })
  },
  register() {
    let account = this.data.account
    let password = this.data.password
    if (account.length < 2) {
      wx.showToast({
        icon: 'none',
        title: '账号至少2位',
      })
      return
    }
    if (account.length > 10) {
      wx.showToast({
        icon: 'none',
        title: '账号最多10位',
      })
      return
    }
    if (password.length < 4) {
      wx.showToast({
        icon: 'none',
        title: '密码至少4位',
      })
      return
    }
    wx.cloud.database().collection('user').add({
      data: {
        account: account,
        password: password
      },
      success(res) {
        console.log('注册成功', res)
        wx.showToast({
          title: '注册成功',
        })
      },
      fail(res) {
        console.log('注册失败', res)
      }
    })
  },
  gotoLogin(){
    wx.navigateTo({
      url: '../login/login',
    })
  }
})
Page({
  data: {
    account: '',
    password: ''
  },
  getAccount(event) {
    // console.log('获取用户的账号', event.detail)
    this.setData({
      account: event.detail
    })
  },
  getPassword(event) {
    // console.log('获取用户的密码', event.detail)
    this.setData({
      password: event.detail
    })
  },
  login() {
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
    wx.cloud.database().collection('user').where({
      account: account
    }).get({
      success(res) {
        console.log('获取数据成功', res)
        let user=res.data[0]
        console.log('user',user)
        if(password==user.password){
          console.log('登陆成功')
          wx.showToast({
            title: '登陆成功',
          })
          wx.navigateTo({
            url: '../index/index?name='+user.account,
          })
        }else{
          wx.showToast({
            icon:'error',
            title: '账号或密码错误',
          })
          console.log('登陆失败')
        }
      },
      fail(res) {
        console.log('获取数据失败', res)
      }
    })
  }
})
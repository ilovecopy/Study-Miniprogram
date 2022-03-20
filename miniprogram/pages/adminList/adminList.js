Page({
  data: {
    iconList: [{
        icon: 'my',
        color: 'orange',
        badge: 0,
        name: '用户管理',
        url: "/pages/adminUser/userList/userList"
      }, {
        icon: 'form',
        color: 'orange',
        badge: 0,
        name: '新闻管理',
        url: "/pages/adminComm/commList/commList"
      },
      {
        icon: 'comment',
        color: 'orange',
        badge: 0,
        name: '用户反馈',
        url: "/pages/adminFeedback/feedbackList/feedbackList"
      },
      {
        icon: 'text',
        color: 'orange',
        badge: 0,
        name: '答题管理',
        url: "/pages/adminAnswer/adminAnswer"
      }
    ]

  },
  onShow() {
    this.getUserFeedbackNoreadNum()
  },
  ItenClick(e) {
    let url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url
    })
  },
  getUserFeedbackNoreadNum() {
    // wx.showLoading({
    //   title: '加载中..',
    // })
    wx.cloud.callFunction({
      name: 'db',
      data: {
        $url: "getUserFeedbackNoreadNum"
      }
    }).then(res => {
      // wx.hideLoading()
      let result = res.result
      let info = this.data.iconList.find((item) => item.icon == 'comment')
      if (info) {
        info.badge = result.data
      }
      this.setData({
        iconList: this.data.iconList
      })
    })
  }
})
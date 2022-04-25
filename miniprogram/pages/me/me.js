const app = getApp();
Page({
  data: {
    tableColumns: [{
      title: "姓名",
      key: "nickName",
    }, {
      title: "头像",
      key: "avatarUrl",
      type: 'img',
      imgWidth: '50px',
      imgHeight: '50px'
    }, {
      title: "性别",
      key: "gender",
      render: function (val) {
        return app.$util.isgender(val)
      }
    }, {
      title: "积分",
      key: "integral"
    }],
    dataList: [],
    page: 1,
    limit: 10,
    isLoad: true
  },
  getList() {
    const {
      page,
      limit,
      dataList,
      isLoad
    } = this.data;
    if (!isLoad) {
      return;
    }
    wx.cloud.callFunction({
      name: "db",
      data: {
        $url: "getUserlist",
        page: page,
        limit: limit
      }
    }).then(res => {
      let result = res.result
      if (result.code) {
        if (dataList.length > 0) {
          this.setData({
            dataList: dataList.concat(result.data)
          })
        } else {
          this.setData({
            dataList: result.data
          })
        }
        if (result.data.length < limit) {
          this.setData({
            isLoad: false
          })
        }
        this.setData({
          page: result.data.length > 0 ? page + 1 : page
        })
      }
    })
  },
  initComponent() {
    this.getList();
  },
  onLoad() {
    this.initComponent();
  }
});
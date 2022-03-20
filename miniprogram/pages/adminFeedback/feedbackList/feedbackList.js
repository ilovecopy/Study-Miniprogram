const app = getApp();
Page({
  data: {
    tableColumns: [{
        title: "名称",
        key: "nickName",
        width: "60px",
        render: val => app.$util.LimitNumber(val, 4)
      },
      {
        title: "状态",
        key: "isRead",
        width: "60px",
        render: val => (val ? '已读' : '未读')
      },
      {
        title: "内容",
        key: "content",
        render: val => app.$util.LimitNumber(val, 10)
      },
      {
        title: "时间",
        key: "time"
      }
    ],
    dataList: [],
    page: 1,
    limit: 10,
    isLoad: true,
    showInfo: false,
    dataInfo: {}
  },
  onShow() {
    this.initComponent();
  },
  handleClickItem(e) {
    const {
      index
    } = e.detail.value;
    let _this = this
    let dataItem = this.data.dataList[index]
    wx.showActionSheet({
      itemList: ['查看详情'],
      success(res) {
        if (res.tapIndex == 0) {
          if (!dataItem.isRead) {
            _this.chanegRead(dataItem._id)
          }
          _this.setData({
            dataInfo: dataItem,
            showInfo: true
          })
        }
      },
      fail(res) {}
    })
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
        $url: "getFeedbackAdminlist",
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
    this.setData({
      dataList: [],
      page: 1,
      limit: 10,
      isLoad: true
    })
    this.getList();
  },
  hideModal() {
    this.setData({
      showInfo: false
    })
  },
  ViewImage(e) {
    console.log(e)
    wx.previewImage({
      urls: e.currentTarget.dataset.imglist,
      current: e.currentTarget.dataset.url
    });
  },
  chanegRead(_id) {
    wx.cloud.callFunction({
      name: "db",
      data: {
        $url: "updataFeedbackReadAdmin",
        _id: _id
      }
    }).then(res => {
      let result = res.result
      if (result.code) {
        this.data.dataInfo.isRead = true
        let info = this.data.dataList.find(item => item._id == _id)
        if (info) {
          info.isRead = true
        }
        this.setData({
          dataInfo: this.data.dataInfo,
          dataList: this.data.dataList
        })
      }
    })
  }
});
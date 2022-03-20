const app = getApp();
Page({
  data: {
    tableColumns: [{
        title: "标题",
        key: "title",
        render: val => app.$util.LimitNumber(val, 6)
      }, {
        title: "图片",
        key: "img",
        type: 'img',
        imgWidth: '70px',
        imgHeight: '50px'
      },
      {
        title: "内容",
        key: "content",
        width: "300rpx",
        render: val => app.$util.LimitNumber(val, 10)
      }, {
        title: "点赞数",
        key: "likeNum"
      },
      {
        title: "阅读数",
        key: "readNum"
      },
      {
        title: "加入时间",
        key: "date",
        width: "250rpx"
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
      itemList: ['查看详情', '数据修改', '数据删除'],
      success(res) {
        if (res.tapIndex == 0) {
          _this.setData({
            dataInfo: dataItem,
            showInfo: true
          })
        } else if (res.tapIndex == 1) {
          wx.navigateTo({
            url: `../commUpdata/commUpdata?info=${JSON.stringify(dataItem)}`
          })
        } else if (res.tapIndex == 2) {
          wx.showModal({
            title: '提示',
            content: '是否确定删除该数据？',
            success(res) {
              if (res.confirm) {
                wx.showLoading({
                  title: '加载中..',
                })
                wx.cloud.callFunction({
                  name: "db",
                  data: {
                    $url: "delCommAdmin",
                    _id: dataItem._id
                  }
                }).then(res => {
                  wx.hideLoading()
                  let result = res.result
                  if (result.code) {
                    _this.data.dataList.splice(index, 1)
                    _this.setData({
                      dataList: _this.data.dataList
                    })
                  }
                })
              }
            }
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
        $url: "getCommAdminlist",
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
  addBtnHandle() {
    wx.navigateTo({
      url: "../commAdd/commAdd"
    })
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
  }
});
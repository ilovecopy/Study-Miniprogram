const app = getApp();
Page({
  data: {
    total: 0,
    question: null,
    questionList: [],
    current: 0, //swiper当前的index
    tableColumns: [{
        title: "标题",
        key: "title",
        // render: val => app.$util.LimitNumber(val, 6)
      }, 
      {
        title: "内容",
        key: "content",
        width: "300rpx",
        // render: val => app.$util.LimitNumber(val, 10)
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
    let dataItem = this.data.questionList[index]
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
            url: '../backdoor-update/backdoor-update?info='+dataItem
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

  // getList() {
  //   const that = this;
  //   wx.cloud
  //     .callFunction({
  //       name: "questionPool",
  //       data: {
  //         type: "selectRecord",
  //         page: 1,
  //         size: 330,
  //         mode: 1
  //       },
  //     })
  //     .then((res) => {
  //       console.log(res.result)
  //       const {
  //         questionList,
  //         errMsg,
  //         errCode
  //       } = res.result;
  //       if (errCode == 0) {
  //         const total = questionList.length;
  //         const question = questionList[that.data.currentIndex];
  //         console.log('题目=', question)
  //         const comment = questionList[that.data.currentIndex].comment;
  //         console.log('评论=', comment)
  //         that.checkStar(question._id);
  //         that.setData({
  //           questionList,
  //           total,
  //           question,
  //           comment,
  //         });
  //       }
  //     })
  //     .catch(console.error);
  // },
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
    wx.cloud
    .callFunction({
      name: "questionPool",
      data: {
        type: "gettest",
        page: 1,
        size: 10,
        // mode: app.globalData.mode,
        // index:index
      },
    })
    .then((res) => {
      console.log(res.result)
      const {
        questionList,
        errMsg,
        errCode
      } = res.result;
      if (errCode == 0) {
        const total = questionList.length;
        const question = questionList[this.data.currentIndex];
        const A = questionList[0].options[0].text;
        console.log(A)
        console.log('题目=', questionList)
        this.setData({
          questionList,
          total,
          question,
        });
      } //else {
      //   console.error(errMsg);
      //   wx.showToast({
      //     title: "查询题目失败",
      //     icon: "error",
      //   });
      // }
      // 暂时全局记一下list, 答题卡页直接用了
      // app.globalData.questionList = questionList
    })
    .catch(console.error);
    // wx.cloud.callFunction({
    //   name: "questionPool",
    //   data: {
    //     $url: "selectRecord",
    //     page: page,
    //     limit: limit
    //   }
    // }).then(res => {
    //   let result = res.result
    //   if (result.code) {
    //     if (dataList.length > 0) {
    //       this.setData({
    //         dataList: dataList.concat(result.data)
    //       })
    //     } else {
    //       this.setData({
    //         dataList: result.data
    //       })
    //     }
    //     if (result.data.length < limit) {
    //       this.setData({
    //         isLoad: false
    //       })
    //     }
    //     this.setData({
    //       page: result.data.length > 0 ? page + 1 : page
    //     })
    //   }
    // })
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
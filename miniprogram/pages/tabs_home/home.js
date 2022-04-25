Page({
  data: {
    list: []
  },

  onLoad: function (options) {
    this.onLoadData();
  },

  // onGetFile() {
  //   const {
  //     list
  //   } = this.data;
  //   if (list.length > 0) {
  //     Promise.all(
  //       list.map(i => {
  //         return wx.cloud.downloadFile({
  //           fileID: i.fileId
  //         }).then(item => {
  //           return item.tempFilePath;
  //         }).catch(err => {
  //           console.log('下载失败:', err.message)
  //         })
  //       })
  //     ).then(item => {
  //       this.setData({
  //         list: item.map((i, index) => ({
  //           ...list[index],
  //           fileUrl: i
  //         }))
  //       });
  //     });
  //   }
  // },

  onLoadData: function () {
    wx.showLoading({
      title: '加载中',
    })
    // wx.cloud
    //   .callFunction({
    //     name: "questionPool",
    //     data: {
    //       type: "selectRecord",
    //       page: 1,
    //       size: 330,
    //       mode: 1
    //     },
    //   })
    //   .then((res) => {
    //     console.log(res.result)
    //     const {
    //       list,
    //       errMsg,
    //       errCode
    //     } = res.result;
    //     if (errCode == 0) {
    //       // const total = list.length;
    //       const question = list[that.data.currentIndex];
    //       console.log('题目=', question)
    //       that.setData({
    //         list:res.data
    //       }, this.onGetFile);
    //       console.log(list)
    //     }
    //   })
    //   .catch(console.error);
    const db = wx.cloud.database();
    db.collection('question').get({
      success: res => {
        this.setData({
          list: res.data
        }, this.onGetFile);
        console.log(res.data)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
      }
    });
    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },

  onUpdateUser: options => {
    console.log(options)
    const {
      item
    } = options.currentTarget.dataset;
    wx.navigateTo({
      url: `../user/addForm?_id=${item._id}&title=${item.title}&options=${item.options}&desc=${item.desc}&fileUrl=${item.fileUrl}`,
    });
  },

  onRemoveUser: function (options) {
    const {
      item
    } = options.currentTarget.dataset;
    wx.showModal({
      title: '提示',
      content: `确认删除${item.name}?`,
      success(res) {
        if (res.confirm) {
          remove();
        } else if (res.cancel) {
          return;
        }
      }
    });
    const remove = () => {
      const db = wx.cloud.database();
      db.collection('question').doc(item._id).remove({
        success: res => {
          this.onLoadData();
          wx.showToast({
            title: '删除成功',
          });
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '删除失败',
          })
        }
      })
    };
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoadData();
  }
})

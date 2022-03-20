const app = getApp();
Page({
  data: {
    imgList: [],
    typePicker: ['知识点', '最新资讯', '通知'],
    typeIndex: 0,
    title: '',
    content: '',
    fileIDs: []
  },
  ChooseImage() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: (res) => {
        if (this.data.imgList.length != 0) {
          this.setData({
            imgList: this.data.imgList.concat(res.tempFilePaths)
          })
        } else {
          this.setData({
            imgList: res.tempFilePaths
          })
        }
      }
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
  },
  DelImg(e) {
    wx.showModal({
      title: '提示',
      content: '确定要删除这张图吗？',
      cancelText: '再看看',
      confirmText: '再见',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  PickerChange(e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },
  addComm(e) {
    let {
      title,
      content
    } = e.detail.value
    if (!title) {
      return app.$util.errorToShow("请输入标题")
    }
    if (!content) {
      return app.$util.errorToShow("请输入内容")
    }
    wx.showLoading({
      title: '提交中',
    })
    const promiseArr = []
    //只能一张张上传 遍历临时的图片数组
    for (let i = 0; i < this.data.imgList.length; i++) {
      let filePath = this.data.imgList[i]
      let suffix = /\.[^\.]+$/.exec(filePath)[0]; // 正则表达式，获取文件扩展名
      promiseArr.push(new Promise((reslove, reject) => {
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix,
          filePath: filePath, // 文件路径
        }).then(res => {
          this.setData({
            fileIDs: this.data.fileIDs.concat(res.fileID)
          })
          reslove()
        }).catch(error => {
          console.log(error)
        })
      }))
    }
    Promise.all(promiseArr).then(res => {
      wx.cloud.callFunction({
          name: 'db',
          data: {
            $url: 'addComm',
            content: content,
            imgList: this.data.fileIDs,
            tag: this.data.typePicker[this.data.typeIndex],
            title: title
          }
        }).then(res => {
          wx.hideLoading()
          app.$util.successToShow("提交成功", () => {
            app.$util.navigateBack()
            this.setData({
              imgList: [],
              typeIndex: 0,
              title: '',
              content: ''
            })
          })
        })
        .catch(error => {
          console.log(error)
        })
    })
  }
})
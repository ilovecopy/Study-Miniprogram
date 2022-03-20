let app = getApp()
Page({
  data: {
    _id: -1,
    imgList: [],
    typePicker: ['知识点', '最新资讯', '通知'],
    typeIndex: 0,
    title: '',
    content: ''
  },
  onLoad(options) {
    let {
      info
    } = options
    info = JSON.parse(info)
    let {
      content,
      tag,
      title,
      imgList,
      _id,
    } = info
    this.setData({
      content,
      title,
      imgList,
      _id,
      typeIndex: this.data.typePicker.findIndex(item => item == tag)
    })
  },
  ChooseImage() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: (res) => {
        this.uploadImage(res.tempFilePaths).then(imgList => {
          if (this.data.imgList.length != 0) {
            this.setData({
              imgList: this.data.imgList.concat(imgList)
            })
          } else {
            this.setData({
              imgList: imgList
            })
          }
        })
      }
    });
  },
  uploadImage(imgList) {
    let promiseArr = imgList.map((filePath) => {
      let suffix = /\.[^\.]+$/.exec(filePath)[0];
      return new Promise((reslove, reject) => {
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + suffix,
          filePath: filePath
        }).then(res => {
          reslove(res.fileID)
        }).catch(error => {
          console.log(error)
        })
      })
    })
    return Promise.all(promiseArr)
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

    wx.cloud.callFunction({
        name: 'db',
        data: {
          $url: 'updataCommAdmin',
          commId: this.data._id,
          content: content,
          imgList: this.data.imgList,
          tag: this.data.typePicker[this.data.typeIndex],
          title: title
        }
      }).then(res => {
        wx.hideLoading()

        app.$util.successToShow("修改成功", () => {
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
  }
})
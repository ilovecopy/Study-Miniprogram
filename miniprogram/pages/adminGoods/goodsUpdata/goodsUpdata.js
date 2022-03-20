let app = getApp()
Page({
  data: {
    goodsImgList: [],
    goodsName: '',
    goodsPrice: '',
    goodsContent: ''
  },
  onLoad(options) {
    let {
      info
    } = options
    info = JSON.parse(info)

    let {
      goodsPrice,
      goodsName,
      goodsImgList,
      goodsContent,
      _id,
    } = info

    this.setData({
      goodsPrice,
      goodsName,
      goodsImgList,
      goodsContent,
      _id
    })

  },
  ChooseImage() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album'],
      success: (res) => {
        this.uploadImage(res.tempFilePaths).then(goodsImgList => {
          if (this.data.goodsImgList.length != 0) {
            this.setData({
              goodsImgList: this.data.goodsImgList.concat(goodsImgList)
            })
          } else {
            this.setData({
              goodsImgList: goodsImgList
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
      urls: this.data.goodsImgList,
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
          this.data.goodsImgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            goodsImgList: this.data.goodsImgList
          })
        }
      }
    })
  },
  addGoods(e) {
    let {
      goodsName,
      goodsPrice,
      goodsContent
    } = e.detail.value
    let {
      goodsImgList,
      _id
    } = this.data
    if (!goodsName) {
      return app.$util.errorToShow("请输入名称")
    }
    if (!goodsPrice) {
      return app.$util.errorToShow("请输入价格")
    }
    if (!goodsContent) {
      return app.$util.errorToShow("请输入介绍")
    }
    if (!goodsImgList.length) {
      return app.$util.errorToShow("请选择图片")
    }
    wx.showLoading({
      title: '提交中',
    })
    wx.cloud.callFunction({
        name: 'db',
        data: {
          $url: 'updataGoodsAdmin',
          _id: _id,
          goodsContent: goodsContent,
          goodsImgList: goodsImgList,
          goodsName: goodsName,
          goodsPrice: Number(goodsPrice)
        }
      }).then(res => {
        wx.hideLoading()

        app.$util.successToShow("修改成功", () => {
          app.$util.navigateBack()
          this.setData({
            goodsImgList: [],
            goodsName: '',
            goodsContent: '',
            goodsPrice: ''
          })
        })

      })
      .catch(error => {
        console.log(error)
      })
  }
})
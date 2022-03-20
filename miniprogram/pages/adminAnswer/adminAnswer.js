let app = getApp()
Page({
  data: {
    typePicker: [
      '可回收物', '厨余垃圾', '有害垃圾', '其他垃圾'
    ],
    typeIndex: 0,
    name: ''
  },
  PickerChange(e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },
  addType(e) {
    let {
      name
    } = e.detail.value
    if (!name) {
      return app.$util.errorToShow("请输入垃圾名称")
    }
    let type = this.data.typePicker[this.data.typeIndex]
    wx.cloud.callFunction({
      name: "db",
      data: {
        $url: "addAnswer",
        name,
        type
      }
    }).then(res => {
      let result = res.result
      if (result.code == 1) {
        app.$util.successToShow("添加成功")

      } else if (result.code == 2) {
        app.$util.errorToShow("无法重复添加题目")
      }

      this.setData({
        name: '',
        typeIndex: 0
      })
    })
  },
  importHandle() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: (res) => {
        let path = res.tempFiles[0].path;
        this.uploadExcel(path);
      }
    })
  },
  uploadExcel(path) {
    wx.showLoading({
      title: '上传中...',
    })
    wx.cloud.uploadFile({
      cloudPath: new Date().getTime() + '.xlsx',
      filePath: path,
      success: res => {
        this.analysis(res.fileID);
      }
    })
  },
  analysis(fileID) {
    wx.cloud.callFunction({
      name: "db",
      data: {
        $url: "importAnswer",
        fileID: fileID
      }
    }).then(res => {
      let result = res.result
      if (result.code) {
        app.$util.successToShow("导入成功")
        wx.hideLoading()
      }
    })
  }
})
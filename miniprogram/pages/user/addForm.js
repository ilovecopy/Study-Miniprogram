Page({
  data: {
    formData: {},
    fileSrc: '',
    fileId: '',
    temptitle:'',
    tempdesc:''
  },
  changeTitle(event) {
    this.setData({
      temptitle: event
    })
    this.data.formData.title=event;
  },
  changeDesc(event) {
    this.setData({
      tempdesc: event
    })
    this.data.formData.title=event;
  },
  formSubmit: function (e) {
    const {
      formData,
      fileId
    } = this.data;
    const {
      value
    } = e.detail;
    console.log(formData.title)
    // console.log(formData.options)
    // console.log(e.detail)
    const db = wx.cloud.database();
    if (value.title === '' || value.age === '') {
      wx.showToast({
        title: '题目年龄为空',
      });
      return;
    }
    if (formData._id) {
      console.log(formData._id)
      db.collection('question').doc(formData._id).update({
        data: {
          title: formData.title,
          desc: formData.desc
        },
        success: res => {
          console.log(data)
          wx.showToast({
            title: '修改记录成功',
          });
          setTimeout(() => {
            const pages = getCurrentPages();
            if (pages.length > 1) {
              const beforePage = pages[pages.length - 2];
              beforePage.onLoadData();
            }
            wx.switchTab({
              url: '../tabs_home/home',
            });
          }, 2000)
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '修改记录失败'
          })
        }
      });

    } else {
      db.collection('question').add({
        data: {
          ...value,
          fileId
        },
        success: res => {
          wx.showToast({
            title: '新增记录成功',
          });
          setTimeout(() => {
            const pages = getCurrentPages();
            if (pages.length > 1) {
              const beforePage = pages[pages.length - 2];
              beforePage.onLoadData();
            }
            wx.switchTab({
              url: '../tabs_home/home',
            });
          }, 2000);
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '新增记录失败'
          })
        }
      })
    }
    wx.navigateTo({
      url: '../tabs_home/home',
    })
  },

  doUpload() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log('res', res);
        wx.showLoading({
          title: '上传中',
        });
        const filePath = res.tempFilePaths[0];
        this.setData({
          fileSrc: filePath
        });
        const cloudPath = "img/" + new Date().getTime() + "-" + Math.floor(Math.random() * 1000);
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log(res);
            this.setData({
              fileId: res.fileID
            });
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        });
      },
      fail: e => {
        console.error(e)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (Object.keys(options).length > 0) {
      wx.setNavigationBarTitle({
        title: '修改'
      });
      this.setData({
        formData: options
      });
    } else {
      wx.setNavigationBarTitle({
        title: '新增'
      });
      this.setData({
        formData: {}
      });
    }
  },
})
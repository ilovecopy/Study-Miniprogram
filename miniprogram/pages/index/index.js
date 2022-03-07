Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options", options)
    this.setData({
      name: options.name
    })
  },
})
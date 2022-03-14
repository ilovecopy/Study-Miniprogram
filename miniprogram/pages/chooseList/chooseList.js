
Page({

  /**
   * 页面的初始数据
   */
  data: {
    columns: ['杭州', '宁波', '温州', '嘉兴', '湖州'],
  },
  onChange(event) {
    const { picker, value, index } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
  },
  sequence() {
    wx.navigateTo({
      url: '../exam/exam?mode=' + 1,
    })
  },
  random() {
    wx.navigateTo({
      url: '../exam/exam?mode=' + 2,
    })
  }
})
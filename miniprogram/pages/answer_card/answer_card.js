const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },
  /**
   * 点击答题卡的某一项
   */
  onClickCardItem: function (e) {
    let pages = getCurrentPages(); //获取当前页面栈。数组中第一个元素为首页，最后一个元素为当前页面。
    let prevPage = pages[pages.length - 2];
    console.log(prevPage)
    prevPage.setData({
      current: e.currentTarget.dataset.index
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      list: app.globalData.questionList,
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 销毁时恢复上一页的切换动画
    let pages = getCurrentPages();
    setTimeout(function () {
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        swiperDuration: "250",
      })
    }, 500)
  },
  goResult() {
    const that = this;
    // if (!that.data.question.userAnswer) {
    //   console.log(`用户还未回答，不跳转`);
    //   wx.showToast({
    //     title: "请先回答本题",
    //     icon: "none"
    //   });
    //   return;
    // }
    const correctCount = that.data.questionList.reduce((val, cur) => {
      if (that._isCorrect(cur)) {
        val += 1;
      }
      return val;
    }, 0);
    const wrongCount = that.data.questionList.reduce((val, cur) => {
      if (!that._isCorrect(cur)) {
        val += 1;
      }
      return val;
    }, 0);
    const score = Math.round((correctCount * 100) / that.data.total);
    that._recordScore(score);
    that.setData({
      correctCount,
      wrongCount,
      score,
      finish: true,
    });
  },
})
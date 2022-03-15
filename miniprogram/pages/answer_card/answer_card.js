const app = getApp()
Page({
  data: {
    list: [],
    beiti:0
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
      beiti:app.globalData.beiti
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
  _recordScore(score) {
    wx.cloud.callFunction({
        name: "questionPool",
        data: {
          type: "recordScore",
          score: score, //将分数发到云函数
        }
      })
      .then(res => {
        console.log(res);
        const {
          errCode,
          errMsg
        } = res.result;
        if (errCode == 0) {
          console.log(`已记录用户分数 ${score}`);
        } else {
          console.error(errMsg);
        }
      })
      .catch(console.error);
  },
  _isCorrect(question) {
    if (!question.userAnswer) {
      return 0
    } else if (question.answer.sort().join() === question.userAnswer.sort().join()) {
      return 2
    } else {
      return 1
    } //判断用户是否回答正确
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
    const correctCount = that.data.list.reduce((val, cur) => {
      if (that._isCorrect(cur)===2) {
        val += 1;
      }
      return val;
    }, 0);
    const wrongCount = that.data.list.reduce((val, cur) => {
      if (that._isCorrect(cur)===1) {
        val += 1;
      }
      return val;
    }, 0);
    const passCount = that.data.list.reduce((val, cur) => {
      if (that._isCorrect(cur) === 0) {
        val += 1;
      }
      return val;
    }, 0);
    const total=correctCount+wrongCount+passCount;
    const score = Math.round((correctCount * 100) / total);
    that._recordScore(score);
    that.setData({
      correctCount,
      wrongCount,
      passCount,
      score,
      total,
      finish: true,
    });
  },
})
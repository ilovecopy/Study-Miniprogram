import * as echarts from '../../ec-canvas/echarts';
const app = getApp()
function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);
  var option = {
    legend: {
      orient: 'vertical',
      x: 'left',
      data: ['正确','错误','未答']
    },
    color: [
      '#60C5A0',
      '#E7645D',
      '#4C7AF4'
    ],
    backgroundColor: "#ffffff",
    series: [{
      label: {
        normal: {
          fontSize: 14,
          formatter: function (params) {
            return params.name + " " + +params.value + " 题"
         }
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['20%', '40%'],
      data: [{
        value: app.globalData.correctCount,
        name: '正确'
      }, {
        value: app.globalData.wrongCount,
        name: '错误'
      }, {
        value: app.globalData.passCount,
        name: '未答'
      }]
    }]
  };
  chart.setOption(option);
  return chart;
}
Page({
  data: {
    ec: {
      onInit: initChart
    },
    list: [],
    beiti: 0,
    correctCount:0,
    wrongCount:0,
    passCount:0,
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
    wx.navigateBack({//触发onUnLoad
      delta: 1,//关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages 获取当前的页面栈，决定需要返回几层。
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      list: app.globalData.questionList,
      beiti: app.globalData.beiti,
      correctCount: app.globalData.correctCount,
      wrongCount: app.globalData.wrongCount,
      passCount: app.globalData.passCount,
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
  _isCorrect(question) {//判断用户是否回答正确
    if (!question.userAnswer || question.userAnswer =="") {
      return 0
    } else if (question.answer.sort().join() === question.userAnswer.sort().join()) {
      return 2
    } else {
      return 1
    } 
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
      if (that._isCorrect(cur) === 2) {
        val += 1;
      }
      return val;
    }, 0);
    const wrongCount = that.data.list.reduce((val, cur) => {
      if (that._isCorrect(cur) === 1) {
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
    const total = correctCount + wrongCount + passCount;
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
    app.globalData.correctCount=correctCount
    app.globalData.passCount=passCount
    app.globalData.wrongCount=wrongCount
  },
  gotoCollection(){
    wx.reLaunch({
      url: '../collection/collection',
    })
  },
  goHome(){
    wx.reLaunch({
      url: '../index/index',
    })
  }
})
// pages/results/results.js
const app = getApp();
const db = wx.cloud.database();
const activityRecord = db.collection('activityRecord');

Page({
  data: {
    totalScore: null,
    wrong: 0,
    zql: null,
  },

  onLoad(options) {
    // 查看答题成绩
    this.getExamResult(options.id);
  },

  // 系统自动判分
  getExamResult(id){
    wx.showLoading({
      title: '系统判分中'
    });
    activityRecord
    .doc(id)
    .get()
    .then(res => {
      let examResult = res.data;
      
      let { wrong, totalScore } = examResult;
      this.setData({
        totalScore,
        wrong,
        zql: (20-wrong)/20*100
      })

      wx.hideLoading();
    })
  },

  // 再答一次
  toDoTestAgain(){
    wx.reLaunch({
      url: '../test/test'
    })
  },

  // 返回首页
  toIndex(){
    wx.reLaunch({
      url: '../index/index'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '@你，快来参与消防安全知识答题活动吧~'
    }
  },
})
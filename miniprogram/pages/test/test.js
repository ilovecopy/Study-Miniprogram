const app = getApp();

// 连接云数据库
const db = wx.cloud.database();
// 获取集合的引用
const activityQuestion = db.collection('activityQuestion');
const activityRecord = db.collection('activityRecord');
const activityScore = db.collection('activityScore');
// 数据库操作符
const _ = db.command;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList: [],
    index: 0,

    chooseValue: [],
    totalScore: 0,
    wrong: 0,
    wrongList: [],
    wrongListSort: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 获取题库-函数执行
    this.getQuestionList()

  },

  // 获取题库-函数定义
  getQuestionList() {
    // 显示 loading 提示框
    wx.showLoading({
      title: '拼命加载中'
    });
    // 数据库集合的聚合操作实例
    activityQuestion
      .aggregate()
      .match({ //类似于where，对记录进行筛选
        true: _.exists(true)
      })
      .sample({
        size: 20
      })
      .end()
      .then(res => {
        // 获取集合数据，或获取根据查询条件筛选后的集合数据。
        console.log('[云数据库] [activityQuestion] 查询成功')
        console.log(res.list)
        let data = res.list || [];

        // 将数据从逻辑层发送到视图层，通俗的说，也就是更新数据到页面展示
        this.setData({
          questionList: data,
          index: 0
        });

        // 隐藏 loading 提示框
        wx.hideLoading();
      })
  },

  // 选中选项事件
  radioChange(e) {
    this.data.chooseValue[this.data.index] = e.detail.value;
  },

  // 下一题/提交 按钮
  nextSubmit() {

    // 如果没有选择
    if (this.data.chooseValue[this.data.index] == undefined || this.data.chooseValue[this.data.index].length == 0) {
      return wx.showToast({
        title: '请选择答案!',
        icon: 'none'
      })
    }

    // 判断所选择的选项是否为正确答案
    this.chooseJudge();

    // 判断是不是最后一题
    this.lastJudge();
  },

  // 判断所选择的选项是否为正确答案
  chooseJudge() {
    var trueValue = this.data.questionList[this.data.index]['true'];
    var chooseVal = this.data.chooseValue[this.data.index];
    if (chooseVal.toString() != trueValue.toString()) {
      // 答错则记录错题
      this.data.wrong++;
      this.data.wrongListSort.push(this.data.index);
      this.data.wrongList.push(this.data.questionList[this.data.index]._id);
    } else {
      // 答对则累计总分
      this.setData({
        totalScore: this.data.totalScore + 5
      })
    }
  },

  // 判断是不是最后一题
  lastJudge() {
    if (this.data.index < this.data.questionList.length - 1) {
      // 如果不是最后一题，则切换下一题
      let index = this.data.index + 1;
      this.setData({
        index
      })
    } else {
      // 如果是最后一题，则提交答卷
      this.addExamRecord()
    }
  },

  // 提交答卷
  addExamRecord() {
    wx.showLoading({
      title: '提交答卷中'
    });
    let examResult = {
      wrong: this.data.wrong,
      totalScore: this.data.totalScore,
      nickName: app.globalData.hasUserInfo ? app.globalData.userInfo.nickName : '',
      avatarUrl: app.globalData.hasUserInfo ? app.globalData.userInfo.avatarUrl : ''
    };
    activityRecord.add({
      data: {
        ...examResult,
        createDate: db.serverDate()
      }
    }).then(res => {

      activityScore.add({
        data: {
          ...examResult,
          createDate: db.serverDate()
        }
      })

      // 跳转到答题结果页，查看成绩
      wx.reLaunch({
        url: '../result/result?id=' + res._id
      });

      wx.hideLoading();
    })
  }

})
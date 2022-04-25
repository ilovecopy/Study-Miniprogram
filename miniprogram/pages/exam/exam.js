import * as echarts from '../../ec-canvas/echarts';

const app = getApp();

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
      data: ['正确', '错误', '未答']
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
    activeNames: ['0'], //评论面板默认关闭
    ec: {
      onInit: initChart
    },
    total: 0,
    question: null,
    questionList: [],
    finish: false,
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    comment: [],
    content: '',
    current: 0, //swiper当前的index
    // 值为0禁止切换动画
    swiperDuration: "250",
    currentIndex: 0, //真实的index
    // list: [],
    nickName: '微信用户',
    num: 0, //题库号,
    mode: 0,
    active: 0, //默认选中第一个标签
    value: '',
    beiti: 1, //背题
    show: false,
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  showPopup() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },

  onSelect(event) {
    console.log(event.detail);
  },
  swiperChange(e) {
    console.log(e)
    const that = this;
    const newIndex = e.detail.current
    if (newIndex > this.data.currentIndex) {
      this.goNext()
    } else {
      this.goPrev()
    }
    if (newIndex < 0) {
      console.log("已经是第一题")
      return;
    }
    const tempQuestion = that.data.questionList[newIndex];
    that.checkStar(tempQuestion._id);
    that.setData({
      currentIndex: newIndex, //滑动后更新序号
      question: tempQuestion, //滑动后更新题目
    });
  },
  //点击答题卡的某一项
  onClickCardItem: function (e) {
    let pages = getCurrentPages(); //获取当前页面栈。数组中第一个元素为首页，最后一个元素为当前页面。
    let prevPage = pages[pages.length - 2];
    console.log(prevPage)
    prevPage.setData({
      current: e.currentTarget.dataset.index //重新设置current
    })
    // this.setData({
    //   show:false,
    //   current: e.currentTarget.dataset.index //重新设置current
    // })
    // wx.navigateBack({
    //   delta: 1, //回到上一页
    // })
  },
  getList() {
    const that = this;
    // console.log('getList', mode)
    wx.cloud
      .callFunction({
        name: "questionPool",
        data: {
          type: "selectRecord",
          page: 1,
          size: 10,
          mode: app.globalData.mode,
          // index:index
        },
      })
      .then((res) => {
        console.log(res.result)
        const {
          questionList,
          errMsg,
          errCode
        } = res.result;
        if (errCode == 0) {
          const total = questionList.length;
          const question = questionList[that.data.currentIndex];
          console.log('题目=', question)
          const comment = questionList[that.data.currentIndex].comment;
          console.log('评论=', comment)
          that.checkStar(question._id);
          that.setData({
            questionList,
            total,
            question,
            comment,
          });
        } //else {
        //   console.error(errMsg);
        //   wx.showToast({
        //     title: "查询题目失败",
        //     icon: "error",
        //   });
        // }
        // 暂时全局记一下list, 答题卡页直接用了
        app.globalData.questionList = questionList
      })
      .catch(console.error);
  },
  _collectAnswer(selectedValue, tempQuestion) {
    // if (tempQuestion.type == 'radio') {
    //   return [selectedValue];
    // } else if (tempQuestion.type == 'checkbox') {
    let currentAnswer = tempQuestion.userAnswer || [];
    if (currentAnswer.includes(selectedValue)) { //includes() 方法用来判断一个数组是否包含一个指定的值，如果是返回 true，否则false。
      currentAnswer.splice(currentAnswer.indexOf(selectedValue), 1) //indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置。
    } else { //包含了就删除，没包含就加入
      currentAnswer.push(selectedValue)
    }
    return currentAnswer.sort();
    // }
  },
  onClickAnswerCard: function (e) {
    let that = this;
    // 因为某一项不一定是在当前项的左侧还是右侧
    // 跳转前将动画去除，以免点击某选项回来后切换的体验很奇怪
    that.setData({
      // swiperDuration: "0",
      show: true
    })
    wx.navigateTo({
      url: '../answer_card/answer_card?beiti=' + this.beiti,
    })
  },
  onShowAnswer() {
    let tempQuestion = this.data.question;
    tempQuestion.showAnswer = true;
    this.setData({
      question: tempQuestion,
    })
    this.addCollection();
  },
  onItemClick(event) {
    // console.log(event);
    const selectedValue = event.target.dataset.value;
    let tempQuestion = this.data.question;
    if (tempQuestion.showAnswer) {
      console.log("已经看过答案，不能修改选项")
      return;
    }
    tempQuestion.userAnswer = this._collectAnswer(selectedValue, tempQuestion);
    if (this.data.beiti == 1) {
      if (tempQuestion.type == "radio") { //单选点击直接出答案
        tempQuestion.showAnswer = true;
        this.setData({
          question: tempQuestion
        })
        if (tempQuestion.userAnswer != tempQuestion.answer) { //单选选错直接加错题本
          this.addCollection();
        }
      }
    }
    this.setData({
      question: tempQuestion,
    })
    if (this.data.beiti == 0) {
      if (tempQuestion.type == "radio") {
        console.log(tempQuestion.userAnswer)
        this.goNext()
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      //可使用窗口高度，单位px
      swiperHeight: wx.getSystemInfoSync().windowHeight,
      screenHeight: wx.getSystemInfoSync().screenHeight,
      questionList: app.globalData.questionList,
      beiti: app.globalData.beiti,
      nickName: app.globalData.nickName,
      avatarUrl: app.globalData.avatarUrl,
      mode: app.globalData.mode,
    })
    console.log(options)
    this.getList(options.mode);
    console.log(this.data.beiti)
  },
  goPrev() {
    const that = this;
    const newIndex = that.data.currentIndex - 1;
    if (newIndex < 0) {
      console.log("已经是第一题")
      return;
    }
    const tempQuestion = that.data.questionList[newIndex];
    that.checkStar(tempQuestion._id);
    that.setData({
      currentIndex: newIndex,
      question: tempQuestion,
    });
  },
  goNext() {
    const that = this;
    // if (!that.data.question.userAnswer) {
    //   console.log(`用户还未回答，不跳转`);
    //   wx.showToast({
    //     title: "请先回答本题",
    //     icon: "none"
    //   });
    //   return;
    // }
    that.addCollection(); //如果回答错误则并加入错题集
    const newIndex = that.data.currentIndex + 1; //序号+1
    if (newIndex > that.data.questionList.length - 1) {
      console.log("已经是最后一题")
      return;
    }
    const tempQuestion = that.data.questionList[newIndex]; //取下一个题目
    that.checkStar(tempQuestion._id); //判断下一个题目是否收藏
    that.setData({
      currentIndex: newIndex, //更新序号
      question: tempQuestion, //更新题目
    });
  },
  goResult() {
    wx.showLoading({
      title: '提交答卷中'
    });
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
      if (that._isCorrect(cur) === 2) {
        val += 1;
      }
      return val;
    }, 0);
    const wrongCount = that.data.questionList.reduce((val, cur) => {
      if (that._isCorrect(cur) === 1) {
        val += 1;
      }
      return val;
    }, 0);
    const passCount = that.data.questionList.reduce((val, cur) => {
      if (that._isCorrect(cur) === 0) {
        val += 1;
      }
      return val;
    }, 0);
    const score = Math.round((correctCount * 100) / that.data.total);
    that._recordScore(score);
    that.setData({
      correctCount, //发送正确数
      wrongCount, //发送错误数
      passCount, //发送忽略数
      score, //发送分数
      finish: true, //发送完成信号
    });
    app.globalData.correctCount = correctCount;
    app.globalData.wrongCount = wrongCount;
    app.globalData.passCount = passCount;
    wx.hideLoading();
  },
  _recordScore(score) {
    wx.cloud.callFunction({
        name: "questionPool",
        data: {
          type: "recordScore",
          score: score, //将分数发到云函数
          nickName: this.data.nickName,
          avatarUrl: this.data.avatarUrl,
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
          // console.log('已记录用户分数 ',score);
          console.log('已记录用户名字 ', this.data.nickName);
          // console.log(`已记录用户名字 ${app.globalData.hasUserInfo}`);
        } else {
          console.error(errMsg);
        }
      })
      .catch(console.error);
  },
  _isCorrect(question) { //判断用户是否回答正确
    if (!question.userAnswer || question.userAnswer == "") {
      return 0 //未回答
    } else if (question.answer.sort().join() === question.userAnswer.sort().join()) {
      return 2 //回答正确
    } else {
      return 1
    }
  },
  addCollection() {
    const that = this;
    let tempQuestion = that.data.question; //获取当前题目
    if (that._isCorrect(tempQuestion) == 0) {
      console.log(`用户还未回答，不加错题本逻辑 ${tempQuestion.title}`);
      return;
    }
    if (that._isCorrect(tempQuestion) == 2) {
      console.log(`用户答对了，不加错题本逻辑 ${tempQuestion.title}`);
      return;
    }
    wx.cloud
      .callFunction({
        name: "questionPool",
        data: {
          type: "collect",
          questionId: tempQuestion._id, //将当前题目id发送给云函数
        }
      })
      .then(res => {
        // console.log(res);
        const {
          errCode,
          errMsg
        } = res.result;
        if (errCode == 0) {
          // wx.showToast({ title: '已加入错题本', icon: 'none' });
          console.log(`已加入错题本 ${tempQuestion.title}`);
        } else {
          console.error(errMsg);
        }
      })
      .catch(console.error);
  },
  addStar() {
    const that = this;
    const {showAnswer,starred,userAnswer,...questionForStar} = that.data.question;
    wx.cloud
      .callFunction({
        name: "questionPool",
        data: {
          type: "addStar",
          question: questionForStar,
        }
      })
      .then(res => {
        console.log(res)
        const {
          errMsg
        } = res.result;
        if (errMsg == "document.set:ok") {
          let tempQustion = that.data.question;
          tempQustion.starred = true;
          // const updateKey = `questionList[${that.data.currentIndex}]`;
          that.setData({
            question: tempQustion,
            // [updateKey]:tempQustion,
          });
          wx.showToast({
            title: "已收藏",
            icon: "success",
            duration: 2000,
          });
        } //else {
        //   wx.showModal({
        //     title: "收藏失败",
        //     content: errMsg,
        //     showCancel: false,
        //   });
        // }
      })
  },
  checkStar(questionId) {
    const that = this;
    wx.cloud
      .callFunction({
        name: "questionPool",
        data: {
          type: "checkStar",
          questionId: questionId,
        },
      })
      .then((res) => {
        // console.log(res.result)
        const {
          errMsg,
          total
        } = res.result;
        if (errMsg == "collection.count:ok") {
          let tempQuestion = that.data.question;
          tempQuestion.starred = total > 0;
          that.setData({
            question: tempQuestion,
          });
        } else {
          console.warn("查询收藏失败");
        }
      })
      .catch(console.error);
  },
  removeStar() { //移除收藏
    const that = this;
    wx.cloud
      .callFunction({
        name: "questionPool",
        data: {
          type: "removeStar",
          questionId: that.data.question._id,
        },
      })
      .then((res) => {
        // console.log(res.result);
        const {
          errMsg
        } = res.result;
        if (errMsg == "collection.remove:ok") {
          let tempQustion = that.data.question;
          tempQustion.starred = false;
          // const updateKey = `questionList[${that.data.currentIndex}]`;
          that.setData({
            question: tempQustion,
            // [updateKey]:tempQustion,
          });
          wx.showToast({
            title: "已取消收藏",
            icon: "success",
            duration: 2000,
          });
        } //else {
        // wx.showModal({
        //   title: "取消收藏失败",
        //   content: errMsg,
        //   showCancel: false,
        // });
        //}
      })
      .catch(console.error);
  },
  getComment(event) {
    this.setData({
      content: event.detail
    })
    console.log('获取输入的值', content)
  },
  publish() {
    const that = this;
    let comment = that.data.comment;
    if (this.data.content.length < 4) {
      wx.showToast({
        icon: 'none',
        title: '评论不能少于4个字',
      })
      return
    }
    let commemtList = {}
    commemtList.name = "用户A"
    console.log(this.data.nickName)
    commemtList.content = this.data.content
    let commentArr = this.data.comment
    commentArr.push(commemtList)
    console.log('添加后的评论', commentArr)
    wx.showLoading({
      title: '发表中。。。',
    })
    wx.cloud.callFunction({
      name: "questionPool",
      data: {
        type: "addComment",
        comment: commentArr,
        questionId: that.data.question._id
      }
    }).then(
      res => {
        console.log(res)
        this.setData({
          comment: commentArr,
          content: ''
        })
        wx.hideLoading()
      }
    ).catch(res => {
      wx.hideLoading({})
    })
  },
  gotoCollection() {
    wx.reLaunch({
      url: '../collection/collection',
    })
  },
  goHome() {
    wx.reLaunch({
      url: '../index/index',
    })
  }
});
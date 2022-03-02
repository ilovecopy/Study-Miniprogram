// pages/exam/exam.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    total: 0,

    question: null,
    questionList: [],

    finish:false,

    score:0,
    correctCount:0,
    wrongCount:0,
  },

  getList() {
    const that = this;
    wx.cloud
      .callFunction({
        name: "questionPool",
        data: {
          type: "selectRecord",
          page: 1,
          size: 10,
        },
      })
      .then((res) => {
        // console.log(res.result)
        const { questionList, errMsg, errCode } = res.result;

        if (errCode == 0) {
          const total = questionList.length;
          const question = questionList[that.data.currentIndex];

          that.checkStar(question._id);

          that.setData({
            questionList,
            total,
            question,
          });
        } //else {
        //   console.error(errMsg);
        //   wx.showToast({
        //     title: "查询题目失败",
        //     icon: "error",
        //   });
        // }
      })
      .catch(console.error);
  },
  _collectAnswer(selectedValue,tempQuestion){
    if(tempQuestion.type == 'radio'){
      return [selectedValue];
    }else if(tempQuestion.type == 'checkbox'){
      let currentAnswer = tempQuestion.userAnswer || [];

      if(currentAnswer.includes(selectedValue)){
        currentAnswer.splice(currentAnswer.indexOf(selectedValue),1)
      }else{
        currentAnswer.push(selectedValue)
      }

      return currentAnswer.sort();
    }
  },
  onItemClick(event){
    // console.log(event);
    const selectedValue = event.target.dataset.value;

    let tempQuestion = this.data.question;
    if(tempQuestion.showAnswer){
      console.log("已经看过答案，不能修改选项")
      return;
    }

    tempQuestion.userAnswer = this._collectAnswer(selectedValue,tempQuestion);

    this.setData({
      question:tempQuestion,
    })

  },

  onShowAnswer(){
    let tempQuestion = this.data.question;
    tempQuestion.showAnswer = true;
    this.setData({
      question: tempQuestion,
    })

    this.addCollection();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },

  goPrev(){
    const that = this;
    const newIndex = that.data.currentIndex - 1;
    if(newIndex < 0){
      console.log("已经是第一题")
      return;
    }

    const tempQuestion = that.data.questionList[newIndex];
    that.checkStar(tempQuestion._id);

    that.setData({
      currentIndex: newIndex,
      question:tempQuestion,
    });
  },
  goNext(){
    const that = this;

    if (!that.data.question.userAnswer) {
      console.log(`用户还未回答，不跳转`);
      wx.showToast({ title: "请先回答本题", icon: "none" });
      return;
    }

    // 切换前：验证是否答错并加入错题集
    that.addCollection();

    const newIndex = that.data.currentIndex + 1;
    if(newIndex > that.data.questionList.length - 1){
      console.log("已经是最后一题")
      return;
    }

    const tempQuestion = that.data.questionList[newIndex];
    that.checkStar(tempQuestion._id);

    that.setData({
      currentIndex: newIndex,
      question:tempQuestion,
    });

  },

  goResult(){

    const that = this;

    if (!that.data.question.userAnswer) {
      console.log(`用户还未回答，不跳转`);
      wx.showToast({ title: "请先回答本题", icon: "none" });
      return;
    }

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

  _recordScore(score){
    wx.cloud.callFunction({
      name:"questionPool",
      data:{
        type:"recordScore",
        score:score,
      }
    })
    .then(res=>{
      console.log(res);
      const { errCode, errMsg } = res.result;

      if (errCode == 0) {
        console.log(`已记录用户分数 ${score}`);
      } else {
        console.error(errMsg);
      }
    })
    .catch(console.error);
  },

  _isCorrect(question){
    return question.answer.sort().join() === question.userAnswer.sort().join();
  },

  addCollection(){
    const that = this;
    let tempQuestion = that.data.question;

    if (!tempQuestion.userAnswer) {
      console.log(`用户还未回答，不加错题本逻辑 ${tempQuestion.title}`);
      return;
    }

    if (that._isCorrect(tempQuestion)) {
      console.log(`用户答对了，不加错题本逻辑 ${tempQuestion.title}`);
      return;
    }

    wx.cloud
    .callFunction({
      name:"questionPool",
      data:{
        type:"collect",
        questionId:tempQuestion._id,
      }
    })
    .then(res=>{
      // console.log(res);
      const { errCode, errMsg } = res.result;

      if (errCode == 0) {
        // wx.showToast({ title: '已加入错题本', icon: 'none' });
        console.log(`已加入错题本 ${tempQuestion.title}`);
      } else {
        console.error(errMsg);
      }
    })
    .catch(console.error);

  },

  addStar(){
    const that = this;
    wx.cloud
    .callFunction({
      name:"questionPool",
      data:{
        type:"addStar",
        question: that.data.question,
      }
    })
    .then(res=>{
      console.log(res)
      const { errMsg } = res.result;
      if (errMsg == "document.set:ok") {
        let tempQustion = that.data.question;
        tempQustion.starred = true;
        // const updateKey = `questionList[${that.data.currentIndex}]`;

        that.setData({
          question: tempQustion,
          // [updateKey]:tempQustion,
        });
        // wx.showToast({
        //   title: "收藏成功",
        //   icon: "success",
        //   duration: 2000,
        // });
       } //else {
      //   wx.showModal({
      //     title: "收藏失败",
      //     content: errMsg,
      //     showCancel: false,
      //   });
      // }
    })
  },

  checkStar(questionId){
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
        const { errMsg, total } = res.result;

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

  removeStar(){
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
        const { errMsg } = res.result;
        if (errMsg == "collection.remove:ok") {
          let tempQustion = that.data.question;
          tempQustion.starred = false;
          // const updateKey = `questionList[${that.data.currentIndex}]`;

          that.setData({
            question: tempQustion,
            // [updateKey]:tempQustion,
          });

          // wx.showToast({
          //   title: "取消收藏成功",
          //   icon: "success",
          //   duration: 2000,
          // });
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});

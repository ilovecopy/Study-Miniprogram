const app = getApp();
Page({
  data: {
    show: true,
    actions: [{
        name: '答题模式',
        subname: '答题模式类似于考试，交卷后才能查看正误',
      },
      {
        name: '背题模式',
        subname: '背题模式类似于练习，每做完一道题就能看解析',
      },
    ],
    checked1:'',
    checked2:'',
    checked3:'',
    checked4:'',
  },
  onLoad(){
    this.setData({
      checked1:app.globalData.beiti,
      checked2:!app.globalData.beiti,
      checked3:app.globalData.mode,
      checked4:!app.globalData.mode,
    })
  },
  onChange1({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({
       checked1: detail ,
       checked2:!detail
    });
    app.globalData.beiti=this.data.checked1;
  },
  onChange2({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ 
      checked2: detail ,
      checked1:!detail
    });
    app.globalData.beiti=this.data.checked1;
  },
  onChange3({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({
       checked3: detail ,
       checked4:!detail
    });
    app.globalData.mode=this.data.checked3;
  },
  onChange4({ detail }) {
    // 需要手动对 checked 状态进行更新
    this.setData({ 
      checked4: detail ,
      checked3:!detail
    });
    app.globalData.mode=this.data.checked3;
  },
  // beiti() {
  //   app.globalData.beiti = 1;
  //   console.log( app.globalData.beiti )
  // },
  // zuoti() {
  //   app.globalData.beiti = 0;
  //   console.log( app.globalData.beiti )
  // },
  onClose() {
    this.setData({
      show: false
    });
  },
  onSelect(event) {
    console.log(event.detail);
  },
});
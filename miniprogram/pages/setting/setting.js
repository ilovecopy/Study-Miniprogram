const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const app = getApp();
Page({
  data: {
    avatarUrl: defaultAvatarUrl,
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
    checked2:''
  },
  onLoad(){
    this.setData({
      checked1:app.globalData.beiti,
      checked2:!app.globalData.beiti
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
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    }),
    app.globalData.avatarUrl
  },
  beiti() {
    app.globalData.beiti = 1;
    console.log( app.globalData.beiti )
  },
  zuoti() {
    app.globalData.beiti = 0;
    console.log( app.globalData.beiti )
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onSelect(event) {
    console.log(event.detail);
  },
});
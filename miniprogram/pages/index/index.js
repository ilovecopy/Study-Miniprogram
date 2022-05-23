import Toast from "../../miniprogram_npm/@vant/weapp/toast/toast";
const app = getApp()
Page({
  data: {
    nickName: '微信用户',
    avatarUrl: null,
    isVip: false,
    defalultAvatarUrl: "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0",
    code:"",
    isShowUpgradeLayer:false,
  },
  openUpgrade(){
    this.setData({isShowUpgradeLayer:true});
  },
  onClose(){
    this.setData({isShowUpgradeLayer:false});
  },
  updateProfile() {
    const that = this;

    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log('getUserProfile', res)
        let {
          nickName,
          avatarUrl
        } = res.userInfo;
        wx.cloud.callFunction({
            name: "userInfo",
            data: {
              type: "update",
              nickName,
              avatarUrl,
            },
          })
          .then((res) => {
            console.log(res);
            const {
              errCode,
              errMsg
            } = res.result;
            if (errCode == 0) {
              that.setData({
                nickName,
                avatarUrl,
              });
            } else {
              console.warn(errMsg);
              Toast("保存用户信息出错：" + errMsg);
            }
          })
          .catch(console.error);
      },
    })

  },
  _getUserInfo() {
    wx.cloud.callFunction({
        name: "userInfo",
        data: {
          type: "get",
        }
      })
      .then(res => {
        // console.log(res); 
        const {
          errCode,
          errMsg,
          userData
        } = res.result;
        if (errCode == 0) {
          if (userData) {
            const {
              nickName,
              avatarUrl,
              isVip = false
            } = userData;
            this.setData({
              nickName,
              avatarUrl,
              isVip,
            })
          } else {
            console.warn('查询成功，但是用户资料为空')
          }

        } else {
          console.warn(errMsg);
          Toast("查询出错：" + errMsg);
        }
      })
      .catch(console.error);
  },
  upgradeVip(){
    const that = this;
    if(!that.data.code){
      Toast("请输入兑换码");
      return;
    }

    wx.cloud.callFunction({
      name:"userInfo",
      data:{
        type:"upgrade",
        code:that.data.code,
      }
    })
    .then(res=>{
      console.log(res); 
      const { errCode, errMsg } = res.result;
      if(errCode == 0){
        that._getUserInfo();
        Toast.success("兑换成功");
      }else{
        console.warn(errMsg);
        Toast("兑换出错"+errMsg);
        that.setData({
          code:"",
        })
      }
    })
    .catch(console.error);

  },
  //事件处理函数
  goToTest() {
    wx.navigateTo({
      url: '../test/test'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getUserInfo();
  },

  goToDetails() {
    wx.navigateTo({
      url: '../details/details'
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  //微信授权登录
  login() {
    wx.getUserProfile({
      desc: '用于展示排名',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName,
        })
        app.globalData.userInfo = res.userInfo
        app.globalData.hasUserInfo = true
        app.globalData.avatarUrl = res.userInfo.avatarUrl
        app.globalData.nickName = res.userInfo.nickName
      }
    })
  },

  onShareAppMessage(res) {
    return {
      title: '@你，快来刷题吧~'
    }
  },
})
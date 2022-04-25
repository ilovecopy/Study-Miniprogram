import * as db from './util/db.js';
import * as util from './util/util.js';
const app=getApp();
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloud1-6gffyiq6f9e1a91e',
        traceUser: true,
      });
    }
    this.globalData = {
      beiti:true,
      mode:true,//随机答题
      subject:1,//科目
      nickName:'未知用户',
      avatarUrl:'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
      userInfo: {},
      hasUserInfo: false
    };
  },
  $util: util
});
const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 获取用户信息
exports.main = async (event, context) => {
  const queryResult = await db.collection('user')
  .where({
    openId:event.userInfo.openId
  })
  .get();

  const {data, errMsg} = queryResult;
  if (errMsg == "collection.get:ok"){
    return {
      errCode:0,
      errMsg:errMsg,
      userData:data[0],
    }
  }else{
    return {
      errCode:1,
      errMsg:errMsg,
    }
  }
};
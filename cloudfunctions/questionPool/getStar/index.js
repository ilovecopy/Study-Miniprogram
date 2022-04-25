const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  const queryResult = await db.collection('starred')
  .where({
    openId:event.userInfo.openId
  })
    .get(); //默认且最多取 100 条记录。
  const {
    data,
    errMsg
  } = queryResult;
  if (errMsg == "collection.get:ok") {
    return {
      errCode: 0,
      errMsg: errMsg,
      questionList: data,
    }
  } else {
    return {
      errCode: 1,
      errMsg: errMsg,
    }
  }

};
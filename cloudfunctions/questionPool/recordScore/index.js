const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
// 记录分数
exports.main = async (event, context) => {
  console.log('发生了',event)
  const {score, userInfo} = event;
  const addResult = await db.collection('history')
  .add({
    data:{
      openId:userInfo.openId,
      score:score,
      createTime: db.serverDate(),
    }
  });
  console.log(addResult);
  if(addResult.errMsg == "collection.add:ok"){
    return {
      errCode:0,
      errMsg:"OK",
    }
  }else{
    return {
      errCode:1,
      errMsg:addResult.errMsg,
    }
  }
};

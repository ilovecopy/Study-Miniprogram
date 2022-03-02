const cloud = require('wx-server-sdk');
const md5 = require('md5');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 删除收藏
exports.main = async (event, context) => {
  console.log(event)

  const {questionId, userInfo} = event;
  const recordId = md5(questionId + userInfo.openId);
  console.log(recordId)

  return await db.collection('starred').where({
    _id:recordId
  })
  .remove();
  
};

const cloud = require('wx-server-sdk');
const md5 = require('md5');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 添加收藏
exports.main = async (event, context) => {
  console.log(event)

  const {question, userInfo} = event;
  question.openId = userInfo.openId;
  question.questionId = question._id; 

  const {_id, ...restObj} = question;
  const recordId = md5(_id + userInfo.openId);

  return await db.collection('starred').doc(recordId)
  .set({
    data:restObj
  })

};

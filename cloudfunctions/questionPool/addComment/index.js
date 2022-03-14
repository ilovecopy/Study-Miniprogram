const cloud = require('wx-server-sdk');
const md5 = require('md5');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 添加收藏
exports.main = async (event, context) => {
  console.log(event)
  const {
    questionId,
    userInfo
  } = event;
  const recordId = md5(questionId + userInfo.openId);
  console.log(recordId)

  const addResult = await db.collection('question').doc(questionId)
    .update({
      data: {
        // openId:userInfo.openId,
        comment: event.comment
      }
    });
};
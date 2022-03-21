const cloud = require('wx-server-sdk');
const md5 = require('md5');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command;
// 删除错题本的题
exports.main = async (event, context) => {
  console.log(event)
  const {
    questionId,
    userInfo
  } = event;
  const recordId = userInfo.openId;
  const countResult = await db.collection('collection')
    .where({
      _id: recordId
    })
    .count();//判断用户有没有该错题
  console.log(countResult);
  const {
    errMsg,
    total
  } = countResult;
  if (errMsg !== "collection.count:ok") {
    return {
      errCode: 1,
      errMsg: errMsg,
    };
  }
  if (total) {
    const updateResult = await db.collection('collection')
      .doc(recordId)
      .update({
        data: {
          idList: _.pull(questionId)//数组更新操作符。给定一个值或一个查询条件，将数组中所有匹配给定值或查询条件的元素都移除掉。
        }
      });
    console.log(updateResult);
    const {
      errMsg
    } = updateResult;
    if (errMsg == "document.update:ok") {
      return {
        errCode: 0,
        errMsg: "OK",
      }
    } else {
      return {
        errCode: 2,
        errMsg: errMsg,
      }
    }
  } else {
    return{
      errCode:0,
      errMsg:"用户错题已清空",
    }
  }
};
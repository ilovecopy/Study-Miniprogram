const cloud = require('wx-server-sdk');
const md5 = require('md5');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
const _ = db.command;
// 添加错题本
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
          idList: _.addToSet(questionId)//数组更新操作符。原子操作。给定一个或多个元素，除非数组中已存在该元素，否则添加进数组。
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
    const addResult = await db.collection('collection')
      .doc(recordId)
      .set({//更新操作符，用于设定字段等于指定值
        data: {
          idList: [questionId]
        }
      });
    console.log(addResult);
    const {
      errMsg
    } = addResult;
    if (errMsg == "document.set:ok") {
      return {
        errCode: 0,
        errMsg: "OK",
      }
    } else {
      return {
        errCode: 3,
        errMsg: errMsg,
      }
    }
  }
};
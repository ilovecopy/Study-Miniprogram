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
    .count();

  console.log(countResult);

  const { errMsg, total } = countResult;

  if (errMsg !== "collection.count:ok") {
    return {
      errCode:1,
      errMsg:errMsg,
    };
  }

  if(total){
    const updateResult = await db.collection('collection')
      .doc(recordId)
      .update({
        data: {
          idList: _.addToSet(questionId)
        }
      });

    console.log(updateResult);

    const {errMsg} = updateResult;
    if(errMsg == "document.update:ok"){
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

  }else{
    const addResult = await db.collection('collection')
    .doc(recordId)
    .set({
      data: {
        idList: [questionId]
      }
    });

  console.log(addResult);

  const { errMsg } = addResult;

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
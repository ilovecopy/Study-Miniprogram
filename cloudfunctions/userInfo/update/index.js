const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 更新用户信息
exports.main = async (event, context) => {
  console.log(event)

  const {
    nickName,
    avatarUrl,
    isVip,
    userInfo
  } = event;
  const recordId = userInfo.openId;

  let userData = {
    openId: userInfo.openId,
  }

  if (isVip != undefined) {
    userData = {
      ...userData,
      isVip,
    }
  }
  if (nickName != undefined) {
    userData = {
      ...userData,
      nickName,
    }
  }
  if (avatarUrl != undefined) {
    userData = {
      ...userData,
      avatarUrl,
    }
  }

  // 查询用户是否存在
  const countResult = await db.collection('user').where({
      _id: recordId
    })
    .count();

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

  if(total){// 如果已有记录，更新。
    const updateResult = await db.collection('user')
      .doc(recordId)
      .update({
        data: userData
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

  }else{ // 如果未查到用户记录，插入新纪录。
    const addResult = await db.collection('user')
      .doc(recordId)
      .set({
        data: userData
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

}
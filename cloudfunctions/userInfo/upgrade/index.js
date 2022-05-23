const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 升级
exports.main = async (event, context) => {
  console.log(event)

  const {
    code,
    userInfo
  } = event;

  // 1，查询兑换码是不是存在，是不是已经被使用
  const countResult = await db.collection('vipCode').where({
      _id: code,
      openId:null,
    })
    .count();

  console.log("countResult",countResult);

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

  if(total == 0){
    return {
      errCode: 2,
      errMsg: "兑换码已使用或者不存在",
    }
  }

  // 2，更新兑换码，存入用户 openId ，标记已使用
  const updateCodeResult = await db.collection('vipCode')
  .doc(code)
  .update({
    data: {
      openId:userInfo.openId
    }
  });

  console.log('updateCodeResult',updateCodeResult)
  const {errMsg:updateCodeMsg} = updateCodeResult;
  
  if(updateCodeMsg != "document.update:ok"){
    return {
      errCode: 3,
      errMsg: updateCodeMsg,
    }
  }

  // 3，更新用户信息，标记为 VIP 用户
  const updateUserResult = await db.collection('user')
      .doc(userInfo.openId)
      .update({
        data: {
          isVip: true,
        }
      });

  console.log('updateUserResult',updateUserResult)
  const {errMsg:updateUserMsg} = updateUserResult;
  
  if(updateUserMsg != "document.update:ok"){
    return {
      errCode: 4,
      errMsg: updateUserMsg,
    }
  }else{
    return {
      errCode: 0,
      errMsg: "OK",
    }
  }

}
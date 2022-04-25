const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();
/**
 * 分页查询题目列表
 * @param {object} event 
 */
async function getPageData(event) {
  const queryResult = await db.collection('question')
    .skip((event.page - 1) * event.size)
    .limit(event.size) //限制输出size个数据
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
}
// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  // 返回数据库查询结果

    return getPageData(event)

};
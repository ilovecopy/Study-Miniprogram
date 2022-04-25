const cloud = require("wx-server-sdk");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});
const db = cloud.database();
const _ = db.command;

// 查询数据库集合云函数入口函数
// 查询错题库
exports.main = async (event, context) => {
  const recordId = event.userInfo.openId;

  // 先查询用户的错题ID列表
  const queryResult = await db
    .collection("collection")
    .where({
      _id: recordId,
    })
    .get();

  console.log("错题ID列表", queryResult);

  const { data: arrIdRecord, errMsg: errGetId } = queryResult;
  if (errGetId !== "collection.get:ok") {
    console.log(`查询错题ID出错 ${errGetId}`);
    return {
      errCode: 1,
      errMsg: "查询错题ID出错",
    };
  }

  if (arrIdRecord.length === 0 || !arrIdRecord[0].idList) {
    console.log("没有错题");
    return {
      errCode: 3,
      errMsg: "没有错题",
    };
  }

  console.log("idList", arrIdRecord[0].idList);

  // 再用题目ID列表查询题目详情
  const queryResult2 = await db
    .collection("question")
    .where({
      _id: _.in(arrIdRecord[0].idList),
    })
    .get();

  console.log("题目详情列表", queryResult2);

  const { data: questionList, errMsg: errGetQuestion } = queryResult2;
  if (errGetQuestion == "collection.get:ok") {
    return {
      errCode: 0,
      errMsg: "查询成功",
      questionList: questionList,
    };
  } else {
    console.log(`查询题目详情出错 ${errGetQuestion}`);
    return {
      errCode: 2,
      errMsg: "查询题目详情出错",
    };
  }
};

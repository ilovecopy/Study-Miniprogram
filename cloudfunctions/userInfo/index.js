// 云函数入口文件
const update = require('./update/index');
const get = require('./get/index');
const upgrade = require('./upgrade/index');
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'update':
      return await update.main(event, context);
    case 'get':
      return await get.main(event, context);
    case 'upgrade':
      return await upgrade.main(event, context);
  }
}
// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'release-46582a',
})
// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()

  return await db.collection('family_event').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
      event_time: event.event_time,
      event_timestamp: event.event_timestamp,
      event_data: event.event_data
    }
  })
}
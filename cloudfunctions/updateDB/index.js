// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'release-46582a',
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const _ = db.command
  return await db.collection('family_event').doc(event._id).update({
    data: {
      event_data: _.push(event.event_data)
    }
  })
}
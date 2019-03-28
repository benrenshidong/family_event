// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'release-46582a',
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()

  return await db.collection('family_user').add({
    // data 字段表示需新增的 JSON 数据
    data: {
      // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
      _openid: event._openid,
      avatar: event.avatar,
      nickname: event.nickname,
      group_id: [1]
    }
  })
}
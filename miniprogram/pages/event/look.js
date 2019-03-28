// pages/event/look.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    event_list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(this.data)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.data.event_list = []
    let select_date = app.globalData.select_date
    // console.log(select_date)
    const db = wx.cloud.database()
    let _this = this
    // 查询当前用户所有的 counters
    db.collection('family_event').where({
      event_time: select_date
    }).get({
      success: res => {
        // console.log(res.data)
        // console.log(res.data[0].event_data)
        res.data[0].event_data.forEach(x => {
          //查询用户信息
          db.collection('family_user').where({
            _openid: x.open_id
          }).get({
            success: res_new => {
              x.avatar = res_new.data[0].avatar
              x.nickname = res_new.data[0].nickname
              _this.setData({
                event_list: res.data[0].event_data
              })
            }
          })
        })
        // console.log('[数据库] [查询记录] 成功: ', res.data)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //图片点击事件
  imgYu: function(event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
    //图片预览
    wx.previewImage({
    current: src, // 当前显示图片的http链接
    urls: imgList // 需要预览的图片http链接列表
    })
  }
})
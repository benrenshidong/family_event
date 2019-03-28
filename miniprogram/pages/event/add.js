// pages/event/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      content:'',
      imgFilePath:'',
      imgDataSaveId: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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

  inputHandle: function(e) {
    this.setData({
      content: e.detail.value
    });
  },

  onAdd: function () {
    const db = wx.cloud.database()
    const _ = db.command
    let _this = this
    //查询记录id
    // console.log(getApp().globalData.select_date)
    db.collection('family_event').where({
      event_time: getApp().globalData.select_date
    }).get({
      success: res => {
        // console.log(res)
        if(res.data.length > 0) {
          let _id = res.data[0]._id
          //更新记录
          let data = []
          data.push({
            content: this.data.content,
            created_at: Date.parse(new Date()) / 1000,
            open_id: getApp().globalData.openid,
            img_id: this.data.imgDataSaveId
          })
          // console.log(data)
          wx.cloud.callFunction({
            name: 'updateDB',
            data: {
              event_data: data,
              _id: _id
            },
            complete: res => {
              console.log('云函数更新完成: ', res)
              wx.showToast({
                title: '新增事件成功',
              })
              setTimeout(function () {
                wx.redirectTo({
                  url: '/pages/event/look'
                })
              }, 1000)
            }
          })
        } else {
          //新加记录
          let data = []
          data.push({
            content: this.data.content,
            created_at: Date.parse(new Date()) / 1000,
            open_id: getApp().globalData.openid,
            img_id: this.data.imgDataSaveId
          })
          var util = require('../../utils/util.js');
          //当前选择日期的第一天时间戳
          let timestamp = util.getStamp(getApp().globalData.select_date)
          //调用云函数
          wx.cloud.callFunction({
            name: 'addDB',
            data: {
              event_data: data,
              event_time: getApp().globalData.select_date,
              event_timestamp: timestamp
            },
            complete: res => {
              console.log('云函数添加完成: ', res)
              wx.showToast({
                title: '新增事件成功',
              })
              setTimeout(function (){
                wx.redirectTo({
                  url: '/pages/event/look'
                })
              },1000)
            }
          })
        }
      },
      fail: res => {
        console.log('失败:' + res)
      }
    })
  },

  /* 图片的选择与上传部分逻辑 */
  // 上传图片
  doUpload: function () {
    // 选择图片
    let _this = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths
        _this.setData({
          imgFilePath: filePath, 
        })
        // 上传图片
        // 这部分可以自行处理图片的命名方式
        for (let i = 0; i < filePath.length; ++i) {
          let now_file = filePath[i]
          const cloudPath = 'family-image' + Date.parse(new Date()) + i + now_file.match(/\.[^.]+?$/)[0]
          wx.cloud.uploadFile({
            cloudPath,
            filePath:now_file,
            success: res => {
              console.log('[上传文件] 成功：', res)
              imgDataSaveId = _this.data.imgDataSaveId.push(res.fileID)
              _this.setData({
                imgDataSaveId: imgDataSaveId
              })
             
            },
            fail: e => {
              console.error('[上传文件] 失败：', e)
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
            },
            complete: () => {
              wx.hideLoading()
            }
          })
        }
 

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
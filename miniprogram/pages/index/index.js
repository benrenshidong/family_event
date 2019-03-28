// pages/demo/index.js
const MONTHS = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June.', 'July.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: new Date().getFullYear(),      // 年份
    month: new Date().getMonth() + 1,    // 月份
    day: new Date().getDate(),
    str: MONTHS[new Date().getMonth()],  // 月份字符串
    isShow: false, //判断按钮是否显示
    demo5_days_style: [],
    select_date: '',
    openid: '',
    url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(this.data.demo5_days_style)
  },
  onShow: function (options) {
    this.textColor(this.data.year, this.data.month);
  },
  //监听点击日历具体某一天的事件:dayClick
  dayClick: function (event) {
    let isShow = true;
    let select_date = event.detail.year + '-' + event.detail.month + '-' + event.detail.day;
    // console.log(select_date);
    this.setData({
      isShow,
      select_date
    });
    getApp().globalData.select_date = select_date
    let demo5_days_style = this.data.demo5_days_style;
    demo5_days_style.forEach(x=>{
      if (x.day == event.detail.day) {
        x.background = '#8328f0'
      } else {
        if (x.day != this.data.day) {
          x.background = 'white'
        }
      }
    })
    this.setData({
      demo5_days_style
    });
  },
  //监听点击下个月事件:nextMonth
  next: function (event) {
    this.textColor(event.detail.currentYear, event.detail.currentMonth)
  },
  //监听点击上个月事件:prevMonth
  prev: function (event) {
    this.textColor(event.detail.currentYear, event.detail.currentMonth)
  },
  //监听点击日历标题日期选择器事
  dateChange: function (event) {
    this.textColor(event.detail.currentYear, event.detail.currentMonth)
  },
  //日历样式函数
  textColor: function (year, month) {
    const days_count = new Date(year, month, 0).getDate();
    let demo5_days_style = new Array;
    let current_date = year + month; //当前选择年月
    let now_date = new Date().getFullYear() + new Date().getMonth() + 1; //北京时间当前年月
    this.setData({
      year:year,
      month:month
    })
    if (current_date == now_date) {
      demo5_days_style.push({
        month: 'current', day: this.data.day, color: 'white', background: '#f6a8f0'
      });
    } else {
      demo5_days_style.push({
        month: 'current', day: this.data.day, color: '#a18ada'
      });
    }
    wx.showLoading({
      title: '正在加载数据...',
    })
    for (let i = 1; i <= days_count; i++) {
      const date = new Date(year, month - 1, i);
      if (date.getDay() == 0) {
        demo5_days_style.push({
          month: 'current', day: i, color: '#f488cd'
        });
      } else if (i == this.data.day) {
        // demo5_days_style.push({
        //   month: 'current', day: i, color: 'white', background: '#f6a8f0'
        // });
      } else {
        demo5_days_style.push({
          month: 'current', day: i, color: '#a18ada'
        });
      }
    }
    var util = require('../../utils/util.js');
    //当前选择日期的第一天时间戳
    let timestamp_star = util.getStamp(year + '-' + month + '-1')
    let timestamp_end = util.getStamp(year + '-' + month + '-' + days_count)
    console.log(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + this.data.day)
    // 查询哪天有事件，改变背景色
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('family_event').where({
      event_timestamp: _.gte(timestamp_star).and(_.lte(timestamp_end))
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res)
        if (res.data.length > 0) {
          // 计算哪天有时间
          res.data.forEach(d => {
            let event_day = d.event_time.split("-")[2]
            //如果这一天有事件改变这一天的背景颜色
            demo5_days_style.forEach((x, k) => {
              if (x.day == event_day && d.event_time != new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + this.data.day) {
                x.color = "#EEEE00"
                x.background = "f488cd"
              }
            })
          })

        }
        this.setData({
          demo5_days_style: demo5_days_style
        });
        // console.log(demo5_days_style)
        wx.hideLoading()
      },
      fail: res => {
        console.log('查询失败', res)
        wx.hideLoading()
      }
    })
  },

  add_event: function () {
      wx.navigateTo({
        url: '/pages/event/add'
      })
      // this.setData({
      //   url: '/pages/event/add'
      // })
  },

  look_event: function () {
    wx.navigateTo({
      url: '/pages/event/look'
    })
    // this.setData({
    //   url: '/pages/event/look'
    // })
  },

  onGotUserInfo(e) {
    //查询用户是否是新用户，是新加记录
    // console.log(e.detail.errMsg)
    // console.log(e.detail.userInfo)
    // console.log(e.detail.rawData)
    wx.showLoading({
      title: '正在加载数据...',
    })
    let nickname = e.detail.userInfo.nickName
    let avatar = e.detail.userInfo.avatarUrl
    //获取openid
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        console.log('云函数获取到的openid: ', res.result.openid)
        getApp().globalData.openid = res.result.openid
        this.setData({
          openid: res.result.openid
        })
        //查询用户是否存在
        console.log(this.data.openid)
        const db = wx.cloud.database()
        // 查询当前用户所有的 counters
        db.collection('family_user').where({
          _openid: this.data.openid
        }).get({
          success: res => {
            if (res.data.length == 0) {
              //新增记录
              wx.cloud.callFunction({
                name: 'addUserDB',
                data: {
                  _openid: getApp().globalData.openid,
                  avatar: avatar,
                  nickname: nickname
                },
                complete: ures => {
                  wx.hideLoading()
                  console.log('[数据库] [新增记录] 成功', ures)
                  // wx.navigateTo({
                  //   url: this.data.url
                  // })
                }
              })
            } else {
              wx.cloud.callFunction({
                name: 'updateUserDB',
                data: {
                  avatar: avatar,
                  nickname: nickname
                },
                complete: ures => {
                  wx.hideLoading()
                  // wx.navigateTo({
                  //   url: this.data.url
                  // })
                  console.log('[数据库] [新增记录] 成功', ures)
                }
              })
            }
          },
          fail: err => {
            console.error('[数据库] [查询记录] 失败：', err)
          }
        })
      }
    })
  },

  getTimeStamp: function (time_str = "1970-1-1" ) {
    // var date = '2015-03-05 17:59:00.0';
    let date = time_str.substring(0, 19);
    date = date.replace(/-/g, '/');
    var timestamp = new Date(date).getTime();
    document.write(timestamp);
  }
})
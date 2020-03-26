// pages/index/eqpart/eqpart.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;

    that.setData({
      room_num: options.room_num
    })
    wx.setNavigationBarTitle({
      title: "房间号—" + options.room_num //页面标题参数
    })
    wx.request({
      url: app.globalData.url_online.url_eq + 'equipment/ht/rcu/auth_find_infrared_count/?room=' + options.room_num,
      method: 'GET',
      header: {
        'authorization': app.globalData.codeInfo.new_authorization,
      },
      success: function(res) {
        if (res.data.new_authorization) {
          app.globalData.codeInfo.new_authorization = res.data.new_authorization;
          wx.setStorageSync('codeInfo', app.globalData.codeInfo);
        }

        switch (res.data.message) {
          case 'success':
            console.log('红外异常',res.data)
            that.setData({
              infrared: res.data.infrared
            })
            break;

          case 'authorization invalid':
            app.globalData.userInfo = {};
            app.globalData.codeInfo = {};
            wx.reLaunch({
              url: '/pages/logins/logins',
            })
            break;

          case 'access refused 6':
            wx.showToast({
              title: '权限不足，部分展示且不可操作',
              icon: 'none'
            })
            break;

          default:
            wx.showToast({
              title: '服务出错,错误原因：' + res.data.message,
              icon: "none"
            })
        }


      },
      fail: function() {
        wx.reLaunch({
          url: '/pages/logins/logins',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    that.get_eq();
  },
  /* 
   ** 设备详情  **
   */
  get_eq() {
    let room_num = that.data.room_num;
    http.postReq(app.globalData.url_online.url_eq + 'equipment/ht/room/get_room_detail_status/', {
      'hotel_id': app.globalData.userInfo.hotel_id,
      "room_number": room_num
    }, function(res) {
      console.log('设备详情', res.data.result);
      for (let i in res.data.result) {
        if (res.data.result[i].time) {
          res.data.result[i].time = res.data.result[i].time.split('.')[0];
        }
      }
      that.setData({
        room_certain_status: res.data.result
      })
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
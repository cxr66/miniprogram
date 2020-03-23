// pages/equipment/rcu/rcu.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
const prom = require('../../../utils/prom.js');
const AudioContext = require('../../../utils/AudioContext.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.showLoading({});

    wx.request({
      url: app.globalData.url_online.url_eq + 'equipment/ht/rcu/get_online_rcu/',
      method: 'GET',
      header: {
        'authorization': app.globalData.codeInfo.new_authorization,
      },
      success: function (res) {
        if (res.data.new_authorization) {
          app.globalData.codeInfo.new_authorization = res.data.new_authorization;
          wx.setStorageSync('codeInfo', app.globalData.codeInfo);
        }

        switch (res.data.message) {
          case 'success': 
            console.log('rcu列表', res.data.detail);
            that.setData({
              rcuList: res.data.detail
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
        wx.hideLoading();

      },
      fail: function () {
        wx.reLaunch({
          url: '/pages/logins/logins',
        })
      }
    })
  },
  // 跳转
  navigate: function (e) {
    let link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link
    })
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
    wx.stopPullDownRefresh();
    that.onLoad();
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

  }
})
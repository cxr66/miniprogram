// pages/my/my.js
var app = getApp();
var that = undefined;
const http = require('../../utils/http.js');
const prom = require('../../utils/prom.js');
const AudioContext = require('../../utils/AudioContext.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    tipsNum: 0,
    userInfo: {},
    // 个人信息部分
    infoList:[
      {
        url:'/pages/img/my/icon-person.png',
        desc:'个人信息',
        link:'/pages/my/info/info'
      },
      {
        url: '/pages/img/my/icon-tips.png',
        desc: '消息通知',
        link: '/pages/my/notice/notice'
      },
      {
        url: '/pages/img/my/icon-setting.png',
        desc: '系统设置',
        link: '/pages/my/setting/setting'
      }
    ],
    // 设置
    setList:[
      {
        desc: '账户',
        link: '/pages/my/account/account',
      },
      {
        desc: '我的班次',
        link: '/pages/my/schedule/schedule',
      },
      {
        desc: '我的报表',
        link: '/pages/my/report/report',
      },
      {
        desc: '考勤记录',
        link: '/pages/my/attend/attend',
      },
      {
        desc: '签到',
        link: '/pages/my/sign/sign',
      },
      {
        desc: '换班',
        link: '/pages/my/shiftsChange/shiftsChange',
      },
      {
        desc: '审核',
        link: '/pages/my/audit/audit',
      },
    ],
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    that = this;
    AudioContext.AudioContext('个人中心');
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } 

    let wx_userInfo = wx.getStorageSync('wx_userInfo');
    that.setData({
      wx_userInfo: wx_userInfo
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
    
    http.getReq(app.globalData.url_online.url_9104 + 'room_service/get_room_service_list/?id=' + app.globalData.userInfo.user_id +'&code=1' , function (res) {
      // console.log(res.data);
      that.setData({
        tipsNum: res.data.number
      })
    });
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
  // 跳转
  navigate: function (e) {
    let link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link
    })
  },
  
})
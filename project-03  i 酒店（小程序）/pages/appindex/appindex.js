// pages/appindex/appindex.js 
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
    userInfo: {},
    // 设置
    settingList: [{
        desc: '掌屋',
        link: '/pages/showindex/showindex',
        url: '/pages/img/showindex/showindex-roomstatus.png'
      },
      /* {
        desc: '商城',
        link: '/pages/mallindex/mallindex',
        url: '/pages/img/showindex/showindex-equipment.png'
      },
      {
        desc: '控台',
        link: '/pages/conindex/conindex',
        url: '/pages/img/showindex/showindex-place.png'
      }, */
      {
        desc: '自助机商家后台',
        link: '/pages/zjjindex/zjjindex',
        url: '/pages/img/showindex/showindex-place.png'
      },
      {
        desc: '运台',
        link: '/pages/opeindex/opeindex',
        url: '/pages/img/showindex/showindex-watch.png'
      },
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    AudioContext.AudioContext('可用模块首页');
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    /* http.getReq('http://organ.crowncrystalhotel.com/v1/organization/ht/master_module/get_app/', function (res) {
      console.log('获取模块', res.data);

    }); */
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

  },
  // 跳转
  navigate: function(e) {
    let link = e.currentTarget.dataset.link,
      desc = e.currentTarget.dataset.desc;
    AudioContext.AudioContext(desc);
    if (link == "/pages/showindex/showindex") {
      wx.switchTab({
        url: link,
      })
    } else {
      wx.navigateTo({
        url: link
      })
    }

  },

})
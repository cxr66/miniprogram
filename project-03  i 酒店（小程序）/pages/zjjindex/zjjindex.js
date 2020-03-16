// pages/zjjindex/zjjindex.js
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
      desc: '订单管理',
      link: '/pages/zjjindex/zjjorder/zjjorder',
      url: '/pages/img/zjjindex/icon-zjjorder.png'
    },
    {
      desc: '账务管理',
      link: '/pages/zjjindex/zjjzhangwu/zjjzhangwu',
      url: '/pages/img/zjjindex/icon-zhangwu.png'
    },
    {
      desc: '门卡管理',
      link: '/pages/zjjindex/zjjcard/zjjcard',
      url: '/pages/img/zjjindex/icon-card.png'
    },
    {
      desc: '协议公司',
      link: '/pages/zjjindex/zjjxieyi/zjjxieyi',
      url: '/pages/img/zjjindex/icon-xieyi.png'
    },
    {
      desc: '团队二维码',
      link: '/pages/zjjindex/zjjcode/zjjcode',
      url: '/pages/img/zjjindex/icon-ercode.png'
    },
    {
      desc: '公安黑名单',
      link: '/pages/zjjindex/zjjgongan/zjjgongan',
      url: '/pages/img/zjjindex/icon-gongan.png'
    },
    {
      desc: '发票管理',
      link: '/pages/zjjindex/zjjfapiao/zjjfapiao',
      url: '/pages/img/zjjindex/icon-fapiao.png'
    },
      {
        desc: '房价码',
        link: '/pages/zjjindex/zjjpricecode/zjjpricecodelist/zjjpricecodelist',
        url: '/pages/img/zjjindex/icon-pricecode.png'
      }, 
    /* {
      desc: '基础设置',
      link: '/pages/zjjindex/zjjsetting/zjjsetting',
      url: '/pages/img/zjjindex/icon-setting.png'
    } */
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this; 
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }

    let wx_userInfo = wx.getStorageSync('wx_userInfo');
    that.setData({
      wx_userInfo: wx_userInfo
    })

    /* http.postReq(app.globalData.url_online.url_login + 'common/employee/view_self', {}, function (res) {
      if (res.data.dept_id && res.data.dept_id.name) {
        that.setData({
          hotel: res.data.hotel_id,
        })
      }
      console.log(res.data);

    }); */
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

    var date1 = new Date(),
      time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();
    /* http.getReq(app.globalData.url_online.url_9102 + 'ordering/master_base_list/?code_market="+"ZZJ"', function (res) {
      console.log('订单', res.data);
      that.setData({
        
      })
    }); */
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
    let link = e.currentTarget.dataset.link, desc = e.currentTarget.dataset.desc;
    AudioContext.AudioContext(desc);
    setTimeout(function(){
      wx.navigateTo({
        url: link
      })
    },1000)
  },

})
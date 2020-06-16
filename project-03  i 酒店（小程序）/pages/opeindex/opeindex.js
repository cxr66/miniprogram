// pages/opeindex/opeindex.js
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
      desc: '云打印',
      link: '/pages/opeindex/opeprintlist/opeprintlist',
      url: '/pages/img/opeindex/print.png',
      bg:'background:linear-gradient(0deg,rgba(254,76,78,1) 0%,rgba(254,104,106,1) 100%);'
    }, {
        desc: '测试用例',
        link: '/pages/opeindex/opetest/opetestlist/opetestlist',
        url: '/pages/img/opeindex/test.png',
        bg:'background:linear-gradient(0deg,rgba(136,90,253,1) 0%,rgba(146,130,254,1) 100%);'
      },
     /*  {
        desc: '参数填入',
        link: 'pages/opeindex/opeparfill/opeparfill',
        url: '/pages/img/opeindex/fill.png'
      }, */
      {
        link: '/pages/opeindex/opecateye/cateye',
        desc: '猫眼参数',
        url: '/pages/img/opeindex/fill.png',
        bg:'background:linear-gradient(0deg,rgba(116,207,50,1) 0%,rgba(163,227,70,1) 100%);'
      },
      {
        link: '/pages/opeindex/switch/switch',
        desc: '开关配置',
        url: '/pages/img/opeindex/fill.png',
        bg:''
      },
      {
        link: '/pages/opeindex/roomControlSet/roomControlSet',
        desc: '客控设置',
        url: '/pages/img/opeindex/fill.png',
        bg:'background:linear-gradient(0deg,rgba(116,207,50,1) 0%,rgba(163,227,70,1) 100%);'
      }
      ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this; 
    
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
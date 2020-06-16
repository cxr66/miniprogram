// pages/zjjindex/zjjorder/zjjorder.js 
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
const AudioContext = require('../../../utils/AudioContext.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',

    /* tab栏 */
    menuList: [{
      name: "在住单"
    }, {
      name: "退房单"
      }, {
        name: "异常单"
      }],
    tabScroll: 0,
    currentTab: 0,

    orderform: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    AudioContext.AudioContext('刷新中');
    wx.getSystemInfo({ // 获取当前设备的宽高
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
    wx.showLoading({
      title: ''
    });

    http.getReq(app.globalData.url_online.url_9102 + "bill/get_master_base_list/?code_market=ZZJ", function (res) {
      console.log('查询在住单列表', res.data);
      wx.hideLoading();
      // res.data.results.reverse();
      that.setData({
        orderform: res.data.results
      })
    });
  },

  /* 
   * @clickMenu —— 点击切换 
  */
  clickMenu: function (e) {
    var current = e.currentTarget.dataset.current //获取当前tab的index
    var tabWidth = this.data.windowWidth / 4
    this.setData({
      tabScroll: (current - 2) * tabWidth //使点击的tab始终在居中位置
    })

    if (this.data.currentTab == current) {
      return false
    } else {
      this.setData({
        currentTab: current
      })
    }
    wx.showLoading({
      title: ''
    });
    console.log(that.data.menuList[this.data.currentTab]);
    that.setData({
      orderform: []
    })
    if (that.data.menuList[this.data.currentTab].name == '在住单') {
      http.getReq(app.globalData.url_online.url_9102 + 'bill/get_master_base_list/?page_size=300&code_market=ZZJ', function (res) {
        console.log('查询在住单列表', res.data);
        wx.hideLoading();
        // res.data.results.reverse();
        that.setData({
          orderform: res.data.results
        })
      });
    } else if (that.data.menuList[this.data.currentTab].name == '退房单'){
      http.getReq(app.globalData.url_online.url_9102 + "bill/get_check_out_master_base_list/?page_size=300&code_market=ZZJ", function (res) {
        console.log('查询退房单列表', res.data);
        wx.hideLoading();
        // res.data.results.reverse();
        that.setData({
          orderform: res.data.results
        })
      });
    } else {
      http.getReq(app.globalData.url_online.url_9102 + 'bill/get_abnormal_master_base_list/?page_size=300&code_market=ZZJ', function (res) {
        console.log('查询异常单列表', res.data);
        wx.hideLoading();
        // res.data.results.reverse();
        that.setData({
          orderform: res.data.results
        })
      });
    }
  },
  
  // 跳转
  navigate: function (e) {
    let link = e.currentTarget.dataset.link, desc = e.currentTarget.dataset.desc;
    AudioContext.AudioContext(desc);
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
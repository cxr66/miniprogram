// pages/guestform/guestform.js
var app = getApp();
var that = undefined;
const http = require('../../utils/http.js');
const AudioContext = require('../../utils/AudioContext.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

    searchValue: '',

    /* tab栏 */
    menuList: [{
      name: "在住客人"
    }, {
      name: "预抵客人"
    }, ],
    tabScroll: 0,
    currentTab: 0,
    /* 客人列表 */
    guest_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
    http.getReq(app.globalData.url_online.url_9102 + 'ordering/master_base_list/?page_size=300', function (res) {
      console.log('查询在住单列表', res.data);
      wx.hideLoading();
      that.setData({
        guest_list: res.data.results
      })
    });
  },
  /* 输入 */
  bindinput(e){
    that.setData({ searchValue: e.detail.value })
  },
  /* 搜索 */
  search(){
    
  },
  /* 点击切换 */
  clickMenu: function (e) {
    var current = e.currentTarget.dataset.current //获取当前tab的index
    var tabWidth = this.data.windowWidth / 4;

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
    console.log(that.data.menuList[this.data.currentTab].name)
    if (that.data.menuList[this.data.currentTab].name == '在住客人') {
      
      http.getReq(app.globalData.url_online.url_9102 + 'ordering/master_base_list/?page_size=300', function (res) {
        console.log('查询在住单列表', res.data);
        wx.hideLoading();
        that.setData({
          guest_list: res.data.results
        })
      });
    } else {
      http.getReq(app.globalData.url_online.url_9102 + 'ordering/reserve_base_list/?page_size=300', function (res) {
        console.log('查询预定单列表', res.data);
        wx.hideLoading();
        that.setData({
          guest_list: res.data.results
        })
      });
    }
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

  }
})
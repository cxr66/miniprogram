// pages/index/orderrecord/orderrecord.js
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
      name: "当前房间预定订单"
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
    that.get_reserve_method(options.room_number);
  },
  /** 
    * @get_reserve_method 获取该房间的预定单
  */
  get_reserve_method(room_number) {
    wx.showLoading();
    // 获取的预订单
    let params = {
      room_number: room_number
    }
    http.getDataReq(app.globalData.url_online.url_9102 + 'bill/get_temporary_master_base_list/?page_size=300', params, function (res) {
      console.log('获取是否有预订单', res.data);
      if (res.message == 'success') {
        wx.hideLoading();
        // res.data.results.reverse();
        that.setData({ orderform: res.data.results })
      }
    });
  },
  /* 点击切换 */
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



  },

  /* 输入 */
  bindinput(e) {
    that.setData({ searchValue: e.detail.value })
  },
  /* 搜索 */
  search() {

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
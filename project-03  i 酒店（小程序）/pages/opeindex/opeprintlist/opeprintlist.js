// pages/opeindex/opeprintlist/opeprintlist.js
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
    http.getReq(app.globalData.url_online.url_9503 + 'cloud_printer/config/list', function (res) {
      wx.hideLoading();
      console.log('打印机设备列表', res);
      that.setData({
        printList: res.data.list
      })
    });
  },
  // 跳转
  navigate: function (e) {
    let link = e.currentTarget.dataset.link,
      id = e.currentTarget.dataset.id;; 
    wx.navigateTo({
      url: link+'?id='+id
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
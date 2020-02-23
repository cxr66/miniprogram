// pages/my/report/report.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setList: [
      {
        desc: '交接班报表 1',
        link: '',
      },
      {
        desc: '前台入账明细',
        link: '',
      },
      {
        desc: '交接班报表 2',
        link: '',
      },
      {
        desc: '交接班报表 3',
        link: '',
      },
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;

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

  },
  // 跳转
  navigate: function (e) {
    let link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link
    })
  },

})
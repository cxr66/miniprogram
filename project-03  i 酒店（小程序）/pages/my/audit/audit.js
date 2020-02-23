// pages/my/audit/audit.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eqCheckList: [
      {
        name: '申请类别',
        list: []
      },
      {
        name: '申请状态',
        list: []
      }
    ],

    scheduleList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var date = new Date();
    var Y = date.getFullYear();
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    that.setData({
      begin_date: Y + '-' + M + '-' + D,
      end_date: Y + '-' + M + '-' + D
    });
  },

  /* 
     时间选择器 
  */
  bindDateChange(e) {
    if (e.currentTarget.dataset.flag == '0') {
      this.setData({
        ["eqCheckList[" + 0 + "]name"]: e.detail.value,
      })
    } else {
      this.setData({
        ["eqCheckList[" + 1 + "]name"]: e.detail.value,
      })
    }

    that.get_signlist(that.data.begin_date, that.data.end_date);

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
    that.onLoad();
    wx.stopPullDownRefresh();
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
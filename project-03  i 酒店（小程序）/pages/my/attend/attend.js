// pages/my/attend/attend.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
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
    that  =this;
    var date = new Date();
    var Y = date.getFullYear();
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

    this.setData({ 
      now_date: Y + '-' + M + '-' + D
    })
    that.get_signlist();
  },

  /* 获取签到记录 */
  get_signlist() {
    let url = app.globalData.url_online.url_9503 + 'manage/duty_record/list',
      params = {
        'user_id': app.globalData.userInfo.user_id,
        'from_date': "2019-01-01",
        'to_date': that.data.now_date
      };
    http.postReq(url, params, function (res) {
      console.log('考勤记录', res);
      that.setData({
        attendList: res.data
      })
    });
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
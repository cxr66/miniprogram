// pages/my/report/detail/detail.js

var app = getApp();
var that = undefined;
const http = require('../../../../utils/http.js');
const reportApi = require('../../../../utils/reportApi.js');

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
    let api = options.api;
    console.log(options)
    http.postReq(app.globalData.url_online.url_9102 + api, {'end_biz_date': "2020-07-07",'start_biz_date': "2020-07-07"},function (res) {
      console.log('报表',res.data);
      that.setData({
        reportList: res.data.results
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
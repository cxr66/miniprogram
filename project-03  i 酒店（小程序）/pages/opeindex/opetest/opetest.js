// pages/opeindex/opetest/opetest.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
const prom = require('../../../utils/prom.js');
const AudioContext = require('../../../utils/AudioContext.js');
const WxParse = require("../../../utils/wxParse/wxParse.js")
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
    var description = '<p>该用例为系统初始测试用<img src="https://ispider-oss.oss-cn-hangzhou.aliyuncs.com/test_case/7d93a4dc.jpg" style="max-width: 100%;"><br><img src="https://ispider-oss.oss-cn-hangzhou.aliyuncs.com/test_case/7d93a4dc.jpg" style="max-width: 100%;"><br><img src="https://ispider-oss.oss-cn-hangzhou.aliyuncs.com/test_case/7d93a4dc.jpg" style="max-width: 100%;"><br><img src="https://ispider-oss.oss-cn-hangzhou.aliyuncs.com/test_case/7d93a4dc.jpg" style="max-width: 100%;"><br></p>';
    WxParse.wxParse('description', 'html', description, that, 5); 
 
    wx.showLoading({});
    http.getReq(app.globalData.url_online.url_9102 + 'task/ticket_service/get_test_case_feedback_info/'+options.id+'/', function (res) {
      wx.hideLoading();
      console.log('测试用例详情', res.data);
      that.setData({
        testDetail: res.data
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
// pages/mission/foods/foods.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
const prom = require('../../../utils/prom.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 详细订单
    goodsList: [
      

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    // 叫醒
    http.getReq(app.globalData.url_online.url_9104 + 'room_service/meal/get_rs_meal_list/', function (res) {
      console.log(res.data.results);
      that.setData({
        goodsList: res.data.results
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
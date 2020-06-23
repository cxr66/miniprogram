// pages/hotelList/hotelList.js
var app = getApp();
var that = undefined;
const http = require('../../utils/http.js');
const prom = require('../../utils/prom.js');
const AudioContext = require('../../utils/AudioContext.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: { },
    userInfo: { }, 
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    AudioContext.AudioContext('请选择酒店');
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } 
    // console.log(wx.getStorageSync('hotelList'));
    that.setData({
      hotelList: wx.getStorageSync('hotelList')
    }) 
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // 跳转
  redirect: function(e) {
    let link = e.currentTarget.dataset.link, desc = e.currentTarget.dataset.desc;

    
    wx.redirectTo({
      url: link
    })
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

  },
  // 跳转
  navigate: function(e) {
    let link = e.currentTarget.dataset.link,
      desc = e.currentTarget.dataset.desc,index=e.currentTarget.dataset.index;
    AudioContext.AudioContext(desc);
    app.globalData.codeInfo.new_authorization = that.data.hotelList[index].authorization;
    // console.log(that.data.hotelList[index].authorization);
      wx.navigateTo({
        url: link+'?audit='+that.data.hotelList[index].audit
      })
 

  },

})
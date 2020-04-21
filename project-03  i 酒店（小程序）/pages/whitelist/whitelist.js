// pages/whitelist/whitelist.js
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
      name: "白名单列表"
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
   
    wx.showLoading({
      title: ''
    });
    http.getReq(app.globalData.url_online.url_9503 + 'security/resident/list?page_num=300&source=1', function (res) {
      console.log('白名单列表', res.data);
      wx.hideLoading();
      for (let i in res.data.list){
        if(res.data.list[i].head_img_id){
          
          res.data.list[i].head_img_id = 'https://ispider-oss.oss-cn-hangzhou.aliyuncs.com/' + res.data.list[i].head_img_id
        }
      }
      that.setData({
        orderform: res.data.list
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

  },
  // 跳转
  navigate: function (e) {
    let link = e.currentTarget.dataset.link; 
    wx.navigateTo({
      url: link
    })
  },
})
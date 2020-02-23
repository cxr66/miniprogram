// pages/mission/stranger/stranger.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
const prom = require('../../../utils/prom.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    wx.showLoading({
      title: '',
      mask: true
    })
    that.get_face_event_list();
  },

  /*  
    跳转函数
   */
  navigate(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url + '?faceList=' + JSON.stringify(that.data.faceList[e.currentTarget.dataset.index])
    })
  },
  /* 
    获取陌生人闯入记录
   */
  get_face_event_list() {
    let url = app.globalData.url_online.url_9503 + 'camera/face_event/list?page_size=300&event_type=' + 1;
    http.getReq(url, function(res) {
      let list = res.data.list;
      console.log('获取陌生人闯入记录', res.data);
      for (let i in list){
        let camera_name = list[i].camera_name.split('_');
        list[i].hotel_name = camera_name[0];
        list[i].hotel_building = camera_name[1];
        list[i].hotel_floor = camera_name[2];
        list[i].hotel_detail = camera_name[3];
      }
      that.setData({
        faceList: list
      })
      wx.hideLoading();
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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

  }
})
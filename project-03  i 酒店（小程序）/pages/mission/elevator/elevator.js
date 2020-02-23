// pages/mission/elevator/elevator.js
//获取应用实例
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eleList:[
     
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.get_elevator();
  },
  /* 获取电梯 */
  get_elevator(e) {
    let url = app.globalData.url_online.url_eq +  'equipment/wx/elevator/get_elevator/',
      params = {
        "hotel_id": app.globalData.userInfo.hotel_id
      };

    http.postReq(url, params, function (res) {
      console.log('酒店电梯',res.data);
      if (res.message == 'success'){
        that.setData({
          eleList: res.data
        })
        wx.showToast({
          title: '刷新成功',
          icon: 'none'
        })
      }else{
        wx.showToast({
          title: '请求失败： ' + res.message,
          icon: 'none'
        })
      }
      
    });
  },
  /* 控制电梯 */
  control_elevator(e){
    let url = app.globalData.url_online.url_eq  + 'equipment/wx/elevator/control_elevator/',
        mark = e.currentTarget.dataset.mark,
        floor = e.currentTarget.dataset.floor,
        params = {
          "hotel_id": app.globalData.userInfo.hotel_id,
          "mark": mark,
          "floor": floor
        };
    that.setData({
      eleindex: e.currentTarget.dataset.index,
      eleindex1: e.currentTarget.dataset.index1,
    })
    http.postReq(url, params, function (res) {
      if(res.message == 'success'){
        wx.showToast({
          title: '呼梯成功',
          icon: 'none'
        })
      }else{
        that.setData({
          eleindex: null,
          eleindex1: null,
        })
      }
    });
  },

  havControl(){
    wx.showToast({
      title: '已经呼梯',
      icon: 'none'
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
    that.get_elevator();
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
// pages/my/schedule/schedule.js
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
      name: '起始时间筛选',
      list: []
    },
    {
      name: '终止时间筛选',
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
    })
    that.get_signlist(Y + '-' + M + '-' + D, Y + '-' + M + '-' + D);
  },

  /* 获取班次记录 */
  get_signlist(begin_date, end_date) {
    let url = app.globalData.url_online.url_9503 + 'manage/duty_schedule/get_by_user',
      params = {
        'user_id': app.globalData.userInfo.user_id,
        'from_date': begin_date,
        'to_date': end_date
      };
    http.postReq(url, params, function (res) {
      console.log('获取班次记录', res);
      wx.showToast({
        title: '刷新成功',
        icon: 'none'
      })
      that.setData({
        scheduleList: res.data
      })
    });
  },
   /* 
      时间选择器 
   */
  bindDateChange(e) {
    if(e.currentTarget.dataset.flag == '0'){
      this.setData({
        begin_date: e.detail.value,
        ["eqCheckList[" + 0 + "]name"]: e.detail.value, 
      })
    }else{
      this.setData({
        end_date: e.detail.value,
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
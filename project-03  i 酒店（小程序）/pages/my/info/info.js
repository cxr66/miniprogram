// pages/my/info/info.js
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
  onLoad: function (options) {
    that = this;
    that.setData({
      infoList: [
        {

          code: '姓名：',
          desc: app.globalData.userInfo.user_name
        },

        {

          code: '账号：',
          desc: app.globalData.userInfo.user_id

        },
        /* {

          code: '手机号码：',
          desc: '13812345678'

        }, */
        {

          code: '所属酒店：',
          desc: ''
        },
        {

          code: '所属部门：',
          desc: app.globalData.userInfo.real_name
        },
        {
          code: '我的身份：',
          desc: app.globalData.userInfo.real_name

        },
      ]
    })
  },

  get_user_department(){
    let url = app.globalData.url_online.url_login + 'common/employee/view_self';
    // 获取个人部门信息
    http.postReq(app.globalData.url_online.url_login + 'common/employee/view_self', {}, function (res) {
      if (res.data.dept_id && res.data.dept_id.name){
        that.setData({
          ["infoList[" + 2 + "]desc"]: res.data.hotel_id.desc, 
          ["infoList[" + 3 + "]desc"]: res.data.dept_id.name, 
        })
      } 
      console.log( res.data );

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
    that.get_user_department();
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
// pages/detail/expect/expect.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuList: [{
      name: "可订房数",
      num: 56
    },
    {
      name: "待审批",
      num: 89
    }
    ],
    tabScroll: 0,
    currentTab: 0,
    windowHeight: '',
    windowWidth: '',
    begin_date: new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate()
  },
  clickMenu: function (e) {
    var current = e.currentTarget.dataset.current //获取当前tab的index
    var tabWidth = this.data.windowWidth / 4
    this.setData({
      tabScroll: (current - 2) * tabWidth //使点击的tab始终在居中位置
    })
    if (this.data.currentTab == current) {
      return false
    } else {
      this.setData({
        currentTab: current
      })
    }
  },
  changeContent: function (e) {
    var current = e.detail.current // 获取当前内容所在index,文档有
    var tabWidth = this.data.windowWidth / 5
    this.setData({
      currentTab: current,
      tabScroll: (current - 2) * tabWidth
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.getSystemInfo({ // 获取当前设备的宽高，文档有
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })

    http.getReq(app.globalData.url_online.url_9101 + 'room_status/real_time_situation/', function (res) {
      console.log('经营状况预计',res.data);
      if(res.data){
        that.setData({
          real_time_situation: res.data
        })
      }
    });

    /* 交接班 */
    http.postReq(app.globalData.url_online.url_login + 'report/change_shifts_record/pay_summary_by_date', {
      'employee_id': app.globalData.userInfo.user_id,
      'login_date': that.data.begin_date,
      'shift_id': app.globalData.userInfo.shift_id,
    }, function (res) {
        console.log('交接班报表', res.data);
        wx.showToast({
          title: '刷新成功',
          icon: 'none'
        })
        that.setData({
          shiftList: res.data
        })
    });
  },

  /* 跳转 */
  navigate: function (e) {
    let link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link
    })
  },


  /* 重新编排的js */
   /* 时间选择器 */
  bindDateChange(e) {
    this.setData({
      begin_date: e.detail.value
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
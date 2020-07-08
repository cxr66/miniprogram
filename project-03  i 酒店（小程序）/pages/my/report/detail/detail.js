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
    setList: [
      {
        desc: '冲调账报表', 
        table:[{
          
        }]
      },
      {
        desc: 'AR入账简表', 
        api: reportApi.report_ar_charge_summary_by_date
      },
      {
        desc: 'AR账户实时余额表', 
        api: reportApi.report_ar_account_real_time
      },
      {
        desc: 'AR付款明细', 
        api: reportApi.report_ar_account_pay_details
      },
      {
        desc: 'AR收款简表', 
        api: reportApi.report_ar_pay_summary_by_date
      },
      {
        desc: 'AR入账明细报表', 
        api: reportApi.report_ar_account_charge_details
      },
      {
        desc: '前台转账记录', 
        api: reportApi.report_transfer_details_by_date
      },
      {
        desc: '营业日报（区间）表', 
        api: reportApi.biz_date_daily_interval_report
      },
      {
        desc: '营业日报表', 
        api: reportApi.biz_date_daily_report
      },
      {
        desc: '当前在住', 
        api: reportApi.report_current_in_live_master_guest_list
      },
      {
        desc: '本日将到', 
        api: reportApi.report_today_arrival_reserve_base_list
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let api = options.api;
    wx.setNavigationBarTitle({
      title: options.desc
    })
    http.postReq(app.globalData.url_online.url_9102 + api, {
      'end_biz_date': "2020-07-07",
      'start_biz_date': "2020-07-07"
    }, function (res) {
      console.log('报表', res.data);
      if (res.data instanceof Array) {
        that.setData({
          reportList: res.data
        })
      } else {
        that.setData({
          reportList: res.data.results
        })
      }
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
// pages/my/report/report.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js'); 

const reportApi = require('../../../utils/reportApi.js').reportApi; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setList: [
      {
        desc: '冲调账报表', 
        api: reportApi.report_arrange_detail_list
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
    console.log(link)
    wx.navigateTo({
      url: link
    })
  },

})
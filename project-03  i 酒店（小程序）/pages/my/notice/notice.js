// pages/my/notice/notice.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 详细订单
    goodsList: [
      {
        room_num: '8326',
        name: '安妮',
        order_date: '2019-03-15 11:30',
        phone: '15812345696',
        address: '虹桥国际机场',
        remark: '无',
        goodsList: [
          {
            goods_desc: '矿泉水', number: '2瓶'
          },
          {
            goods_desc: '毛巾', number: '2条'
          },
          {
            goods_desc: '香烟', number: '1包'
          }
        ]
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    
  },
  /* 
    跳转函数
   */
  navigate(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  /* 
    获取所有的消息通知
   */
  get_all_notice(){
    http.getReq(app.globalData.url_online.url_9104 + 'room_service/get_room_service_list/?id=' + app.globalData.userInfo.user_id + '&code=0', function (res) {
      console.log(res.data);
      for (let i in res.data.delivery_list) {
        res.data.delivery_list[i].goods_list = JSON.parse(res.data.delivery_list[i].goods_list);
      }
      that.setData({
        delivery_list: res.data.delivery_list,//送物
        sweep_list: res.data.sweep_list,//打扫
        room_check_list: res.data.room_check_list,//查房
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
    that.get_all_notice();
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
    that.get_all_notice();
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
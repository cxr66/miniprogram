// pages/order/order.js 
var app = getApp();
var that = undefined;
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    begin_date: '2000-01-01',
    // 房间列表
    order_list: []
  },
  // 跳转
  navigate: function (e) {
    let link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link
    })
  },
  // 时间选择器
  bindDateChange(e) {
    this.setData({
      begin_date: e.detail.value
    })
  /*   let begin_date = that.data.begin_date, end_date = that.setDate(20);
    http.getReq(app.globalData.url_online.url_9101 + 'room_status/get_room_type_occupy_list?biz_date__range=' + begin_date + ',' + end_date, function (res) {
      let array = that.union(res.data.results);
      console.log(JSON.stringify(res.data));

      that.setData({
        order_list: array
      })
    }); */
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    var date1 = new Date(),
      time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();
    that.setData({
      begin_date: time1,
      picker_date: time1
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
    // 获取房情信息&biz_data=  + that.data.begin_date
    let begin_date = that.data.begin_date, end_date = that.setDate(20);
    that.get_order();
  },
  /* 
    *** 请求预定单列表
   */
  get_order(){

    http.postReq(app.globalData.url_online.url_9202 + 'booking/get_all_reserve_list/', { "reserve_base": { "code_market_id": [], "code_src_id": [] }, "reserve_guest": {}, "rt_rate": { "room_type": [], "room_class": [] } }, function (res) {
      console.log('预定列表', res.data.results);
      for (let i in res.data.results){
        res.data.results[i].arr_time = res.data.results[i].arr_time.split('T')[0] + " " + res.data.results[i].arr_time.split('T')[1];

        res.data.results[i].leave_time = res.data.results[i].leave_time.split('T')[0] + " " + res.data.results[i].leave_time.split('T')[1];
      }
      that.setData({
        order_list: res.data.results
      })
    });
  },
  // 合并数组中重复的值
  union(arr) {
    arr = arr || [];
    var tmp = {};
    for (var i = 0, len = arr.length; i < len; i++) {
      var obj = arr[i];
      if (obj.biz_date in tmp) {
        tmp[obj.biz_date].can_live_num += obj.can_live_num;
        tmp[obj.biz_date].rsv_num += obj.rsv_num;
        tmp[obj.biz_date].live_num += obj.live_num;
        tmp[obj.biz_date].maintenance_num += obj.maintenance_num;
        tmp[obj.biz_date].occupy_num += obj.occupy_num;
        tmp[obj.biz_date].room_count += obj.room_count;
        tmp[obj.biz_date].room_type += ',' + obj.room_type;
      } else {
        tmp[obj.biz_date] = obj;
      }
    }
    // console.log(tmp)
    var result = [];
    for (var key in tmp) {
      //出租率
      tmp[key].rsv_rate = (tmp[key].rsv_num / (tmp[key].room_count - tmp[key].maintenance_num)).toFixed(2) + '%';
      //入住率
      tmp[key].live_rate = (tmp[key].live_num / (tmp[key].room_count - tmp[key].maintenance_num)).toFixed(2) + '%';
      result.push(tmp[key]);
    }

    return result;
  },
  // 天数增加
  setDate(dayNum) {
    var date1 = new Date(),
      time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();//time1表示当前时间
    var date2 = new Date(date1);
    date2.setDate(date1.getDate() + dayNum);
    var time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
    return time2;
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
    that.onShow();
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
// pages/detail/single/single.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    begin_date: '2019-03-19',
    // 房间列表
    room_list: [ ]
  },
  // 增加一天

  btnadd: function () {

    let Arr = this.data.begin_date.split("-");

    // 需要先转换为Wed Jul 05 2017 13:50:11 GMT+0800 (中国标准时间)这种型式

    let now = new Date(Number(Arr['0']), (Number(Arr['1']) - 1), Number(Arr['2']))

    now.setDate(now.getDate() + 1)

    now = this.formatTime(now)

    this.setData({

      begin_date: now,
    })

    http.getReq(app.globalData.url_online.url_9101 + 'room_status/get_room_type_occupy_list?biz_data=' + now, function (res) {
      let results = that.room_type_change(res.data.results);
      console.log(results);
      that.setData({
        room_list: results
      })
    });
  },
  // 减少一天

  btncud: function () {

    let Arr = this.data.begin_date.split("-");

    // 需要先转换为Wed Jul 05 2017 13:50:11 GMT+0800 (中国标准时间)这种型式

    let now = new Date(Number(Arr['0']), (Number(Arr['1']) - 1), Number(Arr['2']));

    now.setDate(now.getDate() - 1);

    now = this.formatTime(now);

    this.setData({

      begin_date: now

    })
    http.getReq(app.globalData.url_online.url_9101 + 'room_status/get_room_type_occupy_list?biz_data=' + now, function (res) {

      let results = that.room_type_change(res.data.results);
      // console.log(results);
      that.setData({
        room_list: results
      })
    });
  },
  // 格式化时间
  formatTime(date) {

    var year = date.getFullYear();

    var month = date.getMonth() + 1, month = month < 10 ? '0' + month : month;

    var day = date.getDate(), day = day < 10 ? '0' + day : day;

    return year + '-' + month + '-' + day;

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    console.log(options.begin_date);
    that.setData({
      begin_date: options.begin_date
    })
  },
  //  更改房态钱颜色的函数
  room_type_change(results) {
    // 声明颜色的键值对
    var type_base = {};
    for (let j in app.globalData.roomType) {
      let code = app.globalData.roomType[j].code;
      type_base[code] = app.globalData.roomType[j].descript
    }
    console.log(type_base);
    // 循环赋值
    for (let i in results) {
      //入住率
      results[i].live_rate = (results[i].live_num / (results[i].room_count - results[i].maintenance_num)).toFixed(2) + '%';
      //出租率
      results[i].rsv_rate = (results[i].rsv_num / (results[i].room_count - results[i].maintenance_num)).toFixed(2)  + '%';

      if ((results[i].room_count - results[i].maintenance_num) == 0) {
        results[i].live_rate = 0 + '%';
        results[i].rsv_rate = 0 + '%';
      }

      // 通过dict更改显示信息
      results[i].room_type_name = type_base[results[i].room_type];
    }
    return results;
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
    let begin_date = that.data.begin_date;
    http.getReq(app.globalData.url_online.url_9101 + 'room_status/get_room_type_occupy_list?biz_data=' + begin_date, function (res) {
      // console.log(res.data.results);
      let results = that.room_type_change(res.data.results);
      console.log(results); 
      that.setData({
        room_list: results
      })
    });
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

  },
})
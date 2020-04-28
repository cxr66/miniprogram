// pages/mission/roomControl/roomControl.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    room_num: '',
    listShow: true,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;

  },

  /* 获取房间号所在下的设备 */
  query_equipment() {
    if (that.data.room_num.length) {
      wx.showLoading({
        title: '正在查询',
      })
      http.postReq(app.globalData.url_online.url_eq + 'equipment/wx/room/query_equipment/', {
        "hid": app.globalData.codeInfo.user_info.hotel_id,
        "room_number": that.data.room_num
      }, function (res) {
        console.log('客控', res.data.equipment);
        that.setData({
          listShow: false
        })
        wx.hideLoading();
        that.query_light();

      });
    } else {
      wx.showToast({
        title: '请输入房间号',
      })
    }
  },

  /* 勿扰模式 */
  no_bother() {
    http.postReq(app.globalData.url_online.url_eq + 'equipment/ht/rcu/no_bother/', {
      "hid": app.globalData.codeInfo.user_info.hotel_id,
      "room_number": that.data.room_num
    }, function (res) {
      console.log('勿扰模式', res);

    });
  },

  /* 获取房间号所在下的设备 */
  query_light() {
    wx.showLoading({
      title: '正在查询灯光',
    })
    http.postReq(app.globalData.url_online.url_eq + 'equipment/wx/light/query/', {
      "hid": app.globalData.codeInfo.user_info.hotel_id,
      "room_number": that.data.room_num
    }, function (res) {
      console.log('灯光', res);

      that.setData({
        lightList: res.data
      });
      wx.hideLoading();
    });
  },

  /* 控制所在下的灯光 */
  control_light(equipment_type, switch_type) {
    http.postReq(app.globalData.url_online.url_eq + 'equipment/wx/light/control_light/', {
      "hid": app.globalData.codeInfo.user_info.hotel_id,
      "room_number": that.data.room_num,
      "equipment_type": equipment_type,
      "switch_type": switch_type
    }, function (res) {
      console.log('控制灯光成功', res);
      wx.showToast({
        title: '成功',
      })
    });
  },

  /* 控制所在下的窗帘 */
  control_curtain( switch_type) {
    http.postReq(app.globalData.url_online.url_eq + 'equipment/wx/electric_curtain/switch_curtain/', {
      "hid": app.globalData.codeInfo.user_info.hotel_id,
      "room_number": that.data.room_num, 
      "switch_type": switch_type // # 0:close, 1:open, 2:stop
    } , function (res) {
      console.log('控制窗帘成功', res);
      wx.showToast({
        title: '成功',
      })
    });
  },
  /* 开关转换 */
  switchChange(e) {
    console.log(e.detail.value);

    switch (e.currentTarget.dataset.code) {
      case 'light':
        let equipment_type = e.currentTarget.dataset.eqid;
        that.control_light(equipment_type, e.detail.value);
        break;


      case 'curtain': 
      let value ;
      if(e.detail.value){
        value=1
      }else{
        value = 0
      }
        that.control_curtain(value);
        break
      default:
        wx.showToast({
          title: '稍后重试',
          icon: "none"
        })
    }
  },
  bindinput(e) {
    that.setData({
      room_num: e.detail.value
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
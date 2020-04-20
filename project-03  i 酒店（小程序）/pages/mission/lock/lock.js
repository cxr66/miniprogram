// pages/mission/lock/lock.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form:{
      room_number: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  bindinput(e){
    that.setData({
      ['form.room_number']:e.detail.value
    })
  },
  /* 根据房间号开门锁 */
  openLock() {
    let post_data = {
      "hid": app.globalData.userInfo.hotel_id,
      "room_number": that.data.form.room_number
    };
    console.log(that.data.form.room_number)
    if (that.data.form.room_number){
      // 开门
      /* http.postReq(app.globalData.url_online.url_eq + 'equipment/wx/lock/door/open_lock/', post_data, function (res) {
        console.log(res.data);
        wx.showToast({
          title: '开门成功',
          icon: 'none',
          duration: 4000
        })
        http.postReq(app.globalData.url_online.url_eq + 'equipment/ht/lock/add_lock_detail/', {
                "room_number":that.data.form.room_number,
                "open_lock":"mini_program",
                "success_flag":true,
                "detail":that.data.form.room_number+"入住人开锁"
            }, function (res) {
                console.log(res.data);
                wx.showToast({
                  title: '添加开锁记录成功',
                  icon: 'none'
                })
              });
      }); */
      wx.navigateTo({
        url: '/pages/mission/lockAuto/lockAuto?room_number=' + that.data.form.room_number,
      })
      /* wx.chooseImage({
        success(res) {
          const tempFilePaths = res.tempFilePaths
          console.log(res);
          wx.uploadFile({
            url: app.globalData.url_online.url_eq + 'equipment/ht/cateye/xcx_face_recognition/',
            filePath: tempFilePaths,
            name: 'file',
            header: {
              'authorization': app.globalData.codeInfo.new_authorization
            },
            formData: {
              'room_number': that.data.form.room_number
            },
            success(res) {
              const data = res.data;
              console.log(res.data);
              wx.showToast({
                title: '开门成功',
                icon: 'none'
              })
            }
          })
        }
      }) */
    }else{
      wx.showToast({
        title: '请输入一个房间号',
        icon: 'none'
      })
    }
    
  }
})
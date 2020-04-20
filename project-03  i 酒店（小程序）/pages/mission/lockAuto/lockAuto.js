// pages/mission/lockAuto/lockAuto.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
Page({

  takePhoto() {
    const ctx = wx.createCameraContext();
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {  
        let filePath = res.tempImagePath;
        wx.showLoading({ });
        wx.uploadFile({
          url: app.globalData.url_online.url_eq + 'equipment/ht/cateye/xcx_face_recognition/', 
          filePath: filePath,
          name: 'image',
          header: { 
            'Content-Type': 'multipart/form-data',
            'authorization': app.globalData.codeInfo.new_authorization
          },
          formData: {
            'room_number': that.data.room_number,
          },
          success(res) { 
            const data = JSON.parse(res.data) ;
            console.log( JSON.parse(res.data) );
            let lockLogParams = {
              "room_number":that.data.room_number,
              "open_lock":"mini_program",
              "success_flag":true,
              "detail":that.data.room_number+"开锁"
          };
            if (data.message  == 'success'){
              lockLogParams.success_flag = true
              wx.showToast({
                title: '开门成功',
                icon: 'none',
                duration: 4000
              })
              
              wx.hideLoading();
             
            } else if (Array.isArray(data.data)){

              lockLogParams.success_flag = false
              wx.showToast({
                title: data.data[0],
                icon: 'none',
                duration: 5000
              })
            }else{

              lockLogParams.success_flag = false
              wx.showToast({
                title: data.data,
                icon: 'none',
                duration: 5000
              })
            }
            http.postReq(app.globalData.url_online.url_eq + 'equipment/ht/lock/add_lock_detail/', lockLogParams, function (res) {
              console.log(res.data);
              wx.showToast({
                title: '添加开锁记录成功',
                icon: 'none'
              })
            });
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            },2000)
          }
        })
      }
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    flash: "off",
    srcFoot: "/pages/img/camera.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.setData({
      room_number: options.room_number
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio');
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

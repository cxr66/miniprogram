// pages/mission/stranger/strangerDetail/strangerDetail.js
var app = getApp();
var that = undefined;
const http = require('../../../../utils/http.js');
const prom = require('../../../../utils/prom.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图
    indicatorDots: false,
    autoplay: true,
    duration: 3000,
    // 轮播数据
    imgUrls: [
      /* {
        bannerUrl: 'https://www.baidu.com',
        bannerPath: 'https://www.baidu.com/img/superlogo_c4d7df0a003d3db9b65e9ef0fe6da1ec.png?where=super',
        name: ''
      },
      {
        bannerUrl: 'https://www.baidu.com',
        bannerPath: 'https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top_86d58ae1.png',
        name: ''
      }, */

    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    if (options.id) {
      console.log(options.id);
      that.get_face_event_list(options.id);
    } else {
      let faceData = JSON.parse(options.faceList);
      let url = [];
      for (let i in faceData.photo_ids.split(',')) {
        url.push(app.globalData.url_online.url_img + 'camera_face_event/' + faceData.photo_ids.split(',')[i]+ '.jpg')
      }
      faceData.photo_ids = url;
      faceData.camera_name = faceData.camera_name.split('_')[0] + '酒店' + faceData.camera_name.split('_')[1] + '栋' + faceData.camera_name.split('_')[2] + '层' + faceData.camera_name.split('_')[3];
      that.setData({
        faceData: faceData
      })
    }

  },
  /* 
      获取陌生人闯入记录
     */
  get_face_event_list(id) {
    let url = app.globalData.url_online.url_9503 + "camera/face_event/get/" + id;
    http.getReq(url, function(res) {
      let faceData = res.data;
      let url = [];
      for (let i in faceData.photo_ids.split(',')) {
        url.push(app.globalData.url_online.url_img + 'camera_face_event/' + faceData.photo_ids.split(',')[i] + '.jpg')
      }
      faceData.photo_ids = url;
      faceData.camera_name = faceData.camera_name.split('_')[0] + '酒店' + faceData.camera_name.split('_')[1] + '栋' + faceData.camera_name.split('_')[2] + '层' + faceData.camera_name.split('_')[3];
      that.setData({
        faceData: faceData
      })
      wx.hideLoading();
    });
  },
  /* 
    预览图片
   */
  preview() {
    wx.previewImage({
      urls: that.data.faceData.photo_ids,
    })
  },
  /* 
      获取陌生人闯入记录
  */
  get_face_event_list_by_id(id) {
    let url = app.globalData.url_online.url_9503 + 'camera/face_event/list?id=' + id;
    wx.showLoading({
      title: '',
      mask: true
    })
    http.getReq(url, function(res) {
      console.log('根据ID获取陌生  人闯入记录', res.data);

      that.setData({
        faceList: res.data.list
      })
      wx.hideLoading();
    });
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

  }
})
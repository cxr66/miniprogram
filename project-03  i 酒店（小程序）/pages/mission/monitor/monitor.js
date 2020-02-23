// pages/mission/monitor/monitor.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /* 楼层选择 */
    floor_show: false,
    floor_index: 0, //选择的下拉列表下标

    /* 位置选择 */
    pos_show: false,
    pos_index: 0, //选择的下拉列表下标

    /* 楼栋选择 */
    build_show: false,
    build_index: 0, //选择的下拉列表下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    that.get_building_and_floor_list();
  },

  get_building_and_floor_list() {
    let url = app.globalData.url_online.url_monitor + 'camera/ezviz/get_build_list/';

    // 楼栋筛选
    http.getReq(url, function(res) {
      console.log('筛选条件', res.data);
      that.setData({
        buildingList: res.data.building_list,
        floorList: res.data.floor_list,
        posList: res.data.positon_string_list,
      })
      that.get_camera_list();
    });
  },
  /* 获取所有的监控 */
  get_camera_list() {
    // let url = app.globalData.url_online.url_9202 + 'meeting/hall/list';
    let url = app.globalData.url_online.url_monitor + 'camera/ezviz/get_camera_list/';
    http.getReq(url, function(res) {
      console.log('摄像头列表', res.data.results);
      that.setData({
        cameraList: res.data.results
      })
    });
  },
  // 点击下拉显示框
  selectTap(e) {
    if (e.currentTarget.dataset.flag == '0') {
      this.setData({
        floor_show: !this.data.floor_show
      });
    } else if (e.currentTarget.dataset.flag == '1') {
      this.setData({
        pos_show: !this.data.pos_show
      });
    } else if (e.currentTarget.dataset.flag == '2') {
      this.setData({
        build_show: !this.data.build_show
      });
    }


  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    console.log(e.currentTarget.dataset.flag);
    if (e.currentTarget.dataset.flag == '0') {
      this.setData({
        floor_index: Index,
        floor_show: !this.data.floor_show
      });
    } else if (e.currentTarget.dataset.flag == '1') {
      this.setData({
        pos_index: Index,
        pos_show: !this.data.pos_show
      });
    } else if (e.currentTarget.dataset.flag == '2') {
      this.setData({
        build_index: Index,
        build_show: !this.data.build_show
      });
    }
  },

  /* 调取视频 */
  confirm() {

    let building = this.data.buildingList[that.data.build_index], floor = this.data.floorList[that.data.floor_index], position_string = this.data.posList[that.data.pos_index];
    let url = app.globalData.url_online.url_monitor + 'camera/ezviz/get_camera_list/?building=' + building + '&floor= ' + floor + '&position_string= ' + position_string;
    http.getReq(url , function (res) {
      console.log('摄像头列表', res.data.results);
      that.setData({
        cameraList: res.data.results
      })
    });
  },
  statechange(e) {
    console.log('live-player code:', e.detail.code)
  },
  errorPlay(e) {
    wx.showToast({
      title: '播放失败' + e.currentTarget.dataset.error,
      icon: 'none'
    })
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
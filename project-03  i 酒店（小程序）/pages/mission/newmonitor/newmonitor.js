// pages/mission//newmonitor/newmonitor.js 
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    eqCheckList: [{
      name: '摄像头筛选',
      list: []
    },
    {
      name: '通道筛选',
      list: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
    }, 
    ], //筛选条件
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.get_camera_list();
  },
  /* 
    ** 获取通道
   */
  get_live_address_nvr(id, channelNo) {
    let url = app.globalData.url_online.url_monitor + 'camera/ezviz/get_live_address_nvr/' + id + '/';
    http.postReq(url, { 'channelNo': channelNo }, function (res) {
      console.log('根据通道查询详情', res.data);
      that.setData({
        channelNoList: res.data.data,
        ['eqCheckList[' + 1 + '].name']: '通道' + channelNo,
      })
    }); 
  },
  /* 获取所有的监控 */
  get_camera_list() { 
    let url = app.globalData.url_online.url_monitor + 'camera/ezviz/get_camera_list/';
    http.getReq(url, function (res) {
      console.log('摄像头列表', res.data.results);
      
      for (let i in res.data.results){
        res.data.results[i].self_position = res.data.results[i].building + res.data.results[i].floor + res.data.results[i].position_string
      }

      that.setData({
        cameraList: res.data.results,
        ['eqCheckList[' + 0 + '].name']: res.data.results[0].building + res.data.results[0].floor + res.data.results[0].position_string,
      })
      that.get_live_address_nvr(that.data.cameraList[0].id, '1');
    });
  },

  bindPickerChange(e){
    console.log('picker发送选择改变，携带值为', e.detail.value, e.currentTarget.dataset.listindex);
    let listIndex = e.currentTarget.dataset.listindex,
      value = parseInt(e.detail.value);

    if (listIndex == '0'){
      that.setData({
        ['eqCheckList[' + 0 + '].name']: that.data.cameraList[value].self_position,
      }) 
      that.get_live_address_nvr(that.data.cameraList[value].id, '1');
    } else if (listIndex == '1'){
      that.setData({
        ['eqCheckList[' + 1 + '].name']: '通道' + that.data.eqCheckList[1].list[value],
      })
      that.get_live_address_nvr(that.data.cameraList[value].id, that.data.eqCheckList[1].list[value]);
    }
  },

  statechange(e) {
    console.log('live-player code:', e.detail.code)
  },
  errorPlay(e) {
    console.log(e.detail);
    wx.showToast({
      title: '播放失败:' + e.detail.errMsg,
      icon: 'none'
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
// pages/zjjindex/zjjsetting/zjjsetting.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
const AudioContext = require('../../../utils/AudioContext.js');
var date = new Date();
var Y = date.getFullYear();
//月
var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
//日
var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
// 周几
var W = new Date().getDay();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',

    /* tab栏 */
    menuList: [{
        name: "房型设置"
      },
      {
        name: "房间设置"
      }
    ],
    tabScroll: 0,
    currentTab: 0,

    form: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    AudioContext.AudioContext('刷新中');


    wx.getSystemInfo({ // 获取当前设备的宽高
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth, 
        })
      },
    }) 

    wx.showLoading({
      title: ''
    });

    http.getReq(app.globalData.url_online.url_9102 + 'room/room_status/get_room_type_list/?page=1&page_size=300', function(res) {
      console.log('房型列表', res.data);
      wx.hideLoading();
      that.setData({
        roomTypeform: res.data.results
      })
    }); 

    http.getReq(app.globalData.url_online.url_9102 + 'room/room_status/get_room_list/?page=1&page_size=300&ordering=-create_datetime', function(res) {
      console.log('房间列表', res.data);
      wx.hideLoading();
      that.setData({
        roomform: res.data.results
      })
    }); 
  },  
   /**
   * switch开关监听
   */
  listenerSwitch: function(e) {
    console.log('switch类型开关当前状态-----', e.detail.value,'flag', e.currentTarget.dataset.flag);
    let flag = e.currentTarget.dataset.flag,index = e.currentTarget.dataset.index,value;
    if( e.detail.value){
      value = 1
    }else{
      value= 0
    }
    if(flag == '0'){
      let url =app.globalData.url_online.url_9102 + 'room/room_status/update_room_type/'+that.data.roomTypeform[index].id+'/';
      that.data.roomTypeform[index].is_halt = value;
      http.postReq(url,that.data.roomTypeform[index], function(res) {
        console.log('更新房型', res.data);
        wx.showToast({
          title: '更新成功',
        }); 
      });
    }else{
      let url =app.globalData.url_online.url_9102 + 'room/room_status/update_room_map/'+that.data.roomform[index].id+'/';
      that.data.roomform[index].is_halt = value;
      console.log(that.data.roomform[index]);
      http.postReq(url,that.data.roomform[index], function(res) {
        console.log('更新房间设置', res);
        wx.showToast({
          title: '更新成功',
        });
        
      });
    }

  },
  /* 点击切换 */
  clickMenu: function(e) {
    var current = e.currentTarget.dataset.current //获取当前tab的index
    var tabWidth = this.data.windowWidth / 4
    this.setData({
      tabScroll: (current - 2) * tabWidth //使点击的tab始终在居中位置
    })

    if (this.data.currentTab == current) {
      return false
    } else {
      this.setData({
        currentTab: current
      })
    } 

  },
  changeContent: function(e) {
    var current = e.detail.current // 获取当前内容所在index,文档有
    var tabWidth = this.data.windowWidth / 5
    this.setData({
      currentTab: current,
      tabScroll: (current - 2) * tabWidth
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

  },
  // 跳转
  navigate: function(e) {
    let link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link
    })
  },
})
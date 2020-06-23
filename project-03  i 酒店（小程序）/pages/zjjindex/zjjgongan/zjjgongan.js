// pages/zjjindex/zjjgongan/zjjgongan.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
const AudioContext = require('../../../utils/AudioContext.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',

    /* tab栏 */
    menuList: [{
      name: "入店列表"
    },
   /*  {
      name: "离开店列表"
    } */
  ],
    tabScroll: 0,
    currentTab: 0,

    orderform: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    AudioContext.AudioContext('刷新中');
    wx.getSystemInfo({ // 获取当前设备的宽高
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
 
    // 
    that.get_public_security_guest();
  },

  /* 点击切换 */
  clickMenu: function (e) {
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
    wx.showLoading({
      title: ''
    }); 
    
  },
  get_public_security_guest(){
    http.getReq(app.globalData.url_online.url_organ + 'organization/ht/public_security/get_public_security_guest/?have_guest_flag=True&second_use_flag=false&ignore=false&page_size=300', function (res) {
      console.log('入店上传失败列表', res.data);
 
      that.setData({
        orderform: res.data.results
      })
    });
  },
  upload(e){
    let id = e.currentTarget.dataset.id;
    http.postReq(app.globalData.url_online.url_organ + 'organization/ht/public_security/supplement_public_security/',{'info_id':id,}, function (res) {
      console.log('上传成功', res.data);
      wx.showToast({
        title: '上传成功',
        icon:'none'
      })
      that.get_public_security_guest();
    });
  },
  ignore(e){
    let id = e.currentTarget.dataset.id;
    http.postReq(app.globalData.url_online.url_organ + 'organization/ht/public_security/ignore_guest/',{'info_id':id,}, function (res) {
      console.log('忽略成功', res.data);
      wx.showToast({
        title: '忽略成功',
        icon:'none'
      })
      that.get_public_security_guest();
    });
  },
  changeContent: function (e) {
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

  },
  // 跳转
  navigate: function (e) {
    let link = e.currentTarget.dataset.link; 
    wx.navigateTo({
      url: link
    })
  },
})
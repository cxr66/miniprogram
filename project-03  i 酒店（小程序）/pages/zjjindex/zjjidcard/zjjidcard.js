// pages/zjjindex/zjjidcard/zjjidcard.js
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
      name: "身份证读卡器厂商"
    }],
    tabScroll: 0,
    currentTab: 0,

    orderform: [],

    modal: true,
    params:{
      idc_factory:'',
      desc: ''
    }
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
    wx.showLoading({
      title: ''
    });
    that.get_id_factory_base_list();
  },
  /* 查询 */
  get_id_factory_base_list(){
    http.getReq(app.globalData.url_online.url_9102 + 'room/room_lock/get_id_factory_base_list/', function (res) {
      console.log('身份证读卡器管理', res.data);
      wx.hideLoading();
      that.setData({
        orderform: res.data.results
      })
    });
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
    console.log(that.data.menuList[this.data.currentTab])
    if (that.data.menuList[this.data.currentTab].name == '身份证读卡器厂商') {
      that.get_id_factory_base_list();
    } 
  },

  hide(){
    that.setData({
      modal: !that.data.modal
    })
  },
  bindinput(e) {
    // console.log(e.currentTarget.dataset.value);
    let value = e.currentTarget.dataset.value;
    
    this.setData({ 
      [value]: e.detail.value
    })
    // console.log(that.data.params)
  },
  add_id_factory(){ 
    if(that.data.params.idc_factory&&that.data.params.desc){
      http.postReq(app.globalData.url_online.url_9102 + 'room/room_lock/add_id_factory_base/',that.data.params, function (res) {
        console.log('添加身份证读卡器厂商', res.data);
        wx.showToast({
          title: '添加成功',
          icon: 'none',
          duration: 2000,
          success:function(){
            that.get_id_factory_base_list();
            that.hide();
          }
        })
   
      });
    }else{
      wx.showToast({
        title: '上述全部为必填项',
        icon: 'none',
      })
    }
  },
  remove_idc_factory(e){
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '是否确认删除该厂商？',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          http.postReq(app.globalData.url_online.url_9102 + 'room/room_lock/remove_id_factory_base/'+id+'/',{}, function (res) {
            console.log('删除身份证读卡器厂商成功', res);
            wx.showToast({
              title: '删除成功',
              icon: 'none',
              duration: 2000,
            })
            that.get_id_factory_base_list();
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
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
    let link = e.currentTarget.dataset.link, desc = e.currentTarget.dataset.desc;
    AudioContext.AudioContext(desc);
    wx.navigateTo({
      url: link
    })
  },
})
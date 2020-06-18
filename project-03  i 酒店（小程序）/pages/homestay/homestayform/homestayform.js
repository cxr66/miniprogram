// pages/homestay/homestayform/homestayform.js
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
          windowWidth: res.windowWidth
        })
      },
    })
    
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
    wx.showLoading({
      title: ''
    });
    console.log(that.data.menuList[this.data.currentTab]);
    that.setData({
      orderform: []
    })
    if (that.data.menuList[this.data.currentTab].name == '在住订单') {

      http.getReq(app.globalData.url_online.url_9102 + 'bill/get_master_base_list/?page_size=300', function (res) {
        console.log('查询在住单列表', res.data);
        wx.hideLoading(); 
        that.setData({
          orderform: res.data.results
        })
      });
    } else {
      http.getReq(app.globalData.url_online.url_9102 + 'bill/get_temporary_master_base_list/?page_size=300', function (res) {
        console.log('查询预定单列表', res.data);
        wx.hideLoading(); 
        that.setData({
          orderform: res.data.results
        })
      });
    }
  },

  /* 输入 */
  bindinput(e) {
    that.setData({ searchValue: e.detail.value })
  },
  /* 搜索 */
  search() {

  },
  /** *
   * @navigate 跳转
    */
   navigate(e){
     wx.navigateTo({
       url: e.currentTarget.dataset.link,
     })
   },
  /** *
   * @cancle 取消订单
  */
  cancle(e){
    wx.showModal({
      title: '提示',
      content: '是否确认取消?',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定');
          http.postReq(app.globalData.url_online.url_9102 + 'bill/home_stay_cancel/',{id: e.currentTarget.dataset.id},function (res) {
            console.log('取消预定单', res.data);
            wx.showToast({
              title: '取消成功',
              icon:'none'
            })
            http.getReq(app.globalData.url_online.url_9102 + 'bill/get_temporary_master_base_list/?page_size=300', function (res) {
              console.log('查询预定单列表', res.data);
              wx.hideLoading();
              that.setData({
                orderform: res.data.results
              })
            });
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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
    that.setData({
      /* tab栏 */
      menuList: [{
        name: "在住订单"
      }, {
        name: "预定订单"
      }],
      tabScroll: 0,
      currentTab: 0,
      orderform: []
    })
    wx.showLoading({
      title: ''
    });
    http.getReq(app.globalData.url_online.url_9102 + 'bill/get_master_base_list/?page_size=300&ordering=-create_time', function(res) {
      console.log('查询在住单列表', res.data);
      wx.hideLoading(); 
      that.setData({
        orderform: res.data.results
      })
    });
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
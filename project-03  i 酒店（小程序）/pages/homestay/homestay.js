// pages/homestay/homestay.js 
var app = getApp();
var that = undefined;
const http = require('../../utils/http.js');
const AudioContext = require('../../utils/AudioContext.js');
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
      name: "基础信息"
    }],
    tabScroll: 0,
    currentTab: 0,

    form: []
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
          windowWidth: res.windowWidth,
          now_date: Y + '-' + M + '-' + D,
          id: options.id
        })
      },
    })


    
    that.get_face_detail(options.id);
    
  },
  get_face_detail(id){
    wx.showLoading({
      title: '刷新中'
    });
    http.getReq(app.globalData.url_online.url_9102 + 'bill/get_master_base_info/' + id + '/', function (res) {
      console.log('单个预定单详情', res.data);
      wx.hideLoading();
      for (let i in res.data.master_guest) {
        // let id_no= res.data.master_guest[i].id_no,face_id=res.data.master_guest[i].face_id;
        if (res.data.master_guest[i].id_no && res.data.master_guest[i].id_no != null) {
          res.data.master_guest[i].id_no_show = res.data.master_guest[i].id_no.slice(0, 4) + '****' + res.data.master_guest[i].id_no.substr(res.data.master_guest[i].id_no.length - 4);

        }
        if (res.data.master_guest[i].face_id && res.data.master_guest[i].face_id != null) {
          res.data.master_guest[i].face_id_show = res.data.master_guest[i].face_id.slice(0, 4) + '****' + res.data.master_guest[i].face_id.substr(res.data.master_guest[i].face_id.length - 4);
        }

      }
      that.setData({
        formdetail: res.data
      })
    });
  },
  /** *
   * @update_face_id 更新宾客face_id
   */
  update_face_id(e){
    let id=e.currentTarget.dataset.id,url = app.globalData.url_online.url_9102 + 'home_stay/update_face_id/'+id+'/';
    http.postReq(url,{id_no: e.currentTarget.dataset.id_no   }, function (res) {
      console.log('重新添加face_id', res);
      wx.showToast({
        title: '更新成功',
        icon: 'none'
      })
      that.get_face_detail(that.data.id);
    });
  },
  /** *
   * @cancle 取消订单
   */
  cancle(e) {
    wx.showModal({
      title: '提示',
      content: '是否确认取消?',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          http.postReq(app.globalData.url_online.url_9102 + 'home_stay/cancel/', {
            id: that.data.id
          }, function (res) {
            console.log('取消预定单', res.data);
            wx.showToast({
              title: '取消成功',
              icon: 'none'
            })
            wx.navigateBack({
              delta: 1
            })
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    })

  },

  bindinput(e) {
    let index = e.currentTarget.dataset.index,
      changeD = 'form.price[' + index + '][' + that.data.now_date + ']';
    // console.log(that.data.form.price); 
    that.data.form.price[index][that.data.now_date] = parseFloat(e.detail.value);
    // console.log(that.data.form.price[index][that.data.now_date]); 

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
    console.log(that.data.menuList[this.data.currentTab])

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
// pages/zjjindex/zjjpricecode/zjjpricecodeitem/zjjpricecodeitem.js 
var app = getApp();
var that = undefined;
const http = require('../../../../utils/http.js');
const AudioContext = require('../../../../utils/AudioContext.js');
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
      },
      {
        name: "房型列表"
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
          now_date: Y + '-' + M + '-' + D,
          code: options.code,
          id: options.id
        })
      },
    })

    wx.setNavigationBarTitle({
      title: "房价码—" + options.code //页面标题参数
    })

    wx.showLoading({
      title: ''
    });
    http.postReq(app.globalData.url_online.url_9102 + 'room/rate_code/get_rate_code/', {
      rate_code: options.code,
      begin_date: Y + '-' + M + '-' + D,
      end_date: Y + '-' + M + '-' + (D + 1)
    }, function(res) {
      console.log('单个房价码价格详情', res.data);
      wx.hideLoading();
      that.setData({
        form: res.data
      })
    });

    http.getReq(app.globalData.url_online.url_9102 + 'room/rate_code/get_rate_code_info/' + options.id + '/', function(res) {
      console.log('单个房价码详情', res.data);
      wx.hideLoading();
      that.setData({
        formdetail: res.data
      })
    });
  },
  bindinput(e) {
    let index = e.currentTarget.dataset.index,
      changeD = 'form.price[' + index + '][' + that.data.now_date + ']';
    // console.log(that.data.form.price); 
    that.data.form.price[index][that.data.now_date] = parseFloat(e.detail.value);
    // console.log(that.data.form.price[index][that.data.now_date]); 

  },
  /* 修改房价码房型价格 */
  save() {
    that.setData({
      ['form.price']: that.data.form.price
    })
    console.log(that.data.form.price);
    /* let data = {
        operation_type: 'A',
        rate_code: that.data.code,
        begin_date: Y + '-' + M + '-' + D,
        end_date: Y + '-' + M + '-' + (D + 1),
        room_types: dataobj[0].code,
        days_data: JSON.stringify(days_data[0]),
      } */
    wx.showLoading({
      title: ''
    });
    
    if (typeof that.data.formdetail.parent_code == null || that.data.formdetail.parent_code == "" || that.data.formdetail.parent_code == "undefined"){
      for (let i in that.data.form.price) {
        let days_data = {
          0: "0.00",
          1: "0.00",
          2: "0.00",
          3: "0.00",
          4: "0.00",
          5: "0.00",
          6: "0.00",
        };
        days_data[W] = that.data.form.price[i][that.data.now_date];
        console.log(JSON.stringify(days_data[0]))
        http.postReq(app.globalData.url_online.url_9102 + 'room/rate_code/add_rate_code_log/', {
          operation_type: 'A',
          rate_code: that.data.code,
          begin_date: Y + '-' + M + '-' + D,
          end_date: Y + '-' + M + '-' + (D + 1),
          room_types: i,
          days_data: JSON.stringify(days_data),
        }, function (res) {
          console.log('单个房价码价格详情', res.data);
          wx.hideLoading();
          wx.showToast({
            icon: 'none',
            title: '修改成功'
          });

        });
      }
    }else{
      wx.showToast({ 
        icon:'none',
        title: '该房价码为子类房价码，不可更改'
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
    console.log(that.data.menuList[this.data.currentTab])

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
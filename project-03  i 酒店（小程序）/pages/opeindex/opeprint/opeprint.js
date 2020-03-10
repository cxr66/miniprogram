// pages/opeindex/opeprint/opeprint.js 
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    begin_date: '2000-01-01',
    form: {
      printer_name: '', //打印机名称
      printer_mac: '', //打印机网卡的MAC地址
      printer_serial: '', //打印机序列号
      mqtt_login: '', //打印机联连我们Mosquitto服务（MQTT协议)的用户名
      mqtt_password: null, //打印机联连我们Mosquitto服务（MQTT协议) 的密码， 明文，但以PBKDF2密文存到DB.只能比较，无法读出
    },
    tempFilePath: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;

  },


  /* 新增新闻 */
  confirm() {

    if (that.data.form.printer_name && that.data.form.printer_mac && that.data.form.printer_serial && that.data.form.mqtt_login && that.data.form.mqtt_password) {
      wx.showLoading({
        title: '',
        mask: true
      })
      http.postReq(app.globalData.url_online.url_9503 + 'cloud_printer/config/add', that.data.form, function(res) {
        wx.hideLoading();
        wx.showToast({
          title: '保存成功',
        })
      });
    } else {
      wx.showToast({
        title: '上面都为必填字段',
        icon: 'none'
      })
    }
  },
  // 时间选择器
  bindDateChange(e) {
    this.setData({
      begin_date: e.detail.value
    })
  },
  /* input 输入 */
  bindinput(e) {
    if (e.currentTarget.dataset.flag === '0') {
      that.setData({
        ['form.printer_name']: e.detail.value
      })
    } else if (e.currentTarget.dataset.flag === '1') {
      that.setData({
        ['form.printer_mac']: e.detail.value
      })
    } else if (e.currentTarget.dataset.flag === '2') {
      that.setData({
        ['form.printer_serial']: e.detail.value
      })
    } else if (e.currentTarget.dataset.flag === '3') {
      that.setData({
        ['form.mqtt_login']: e.detail.value
      })
    } else if (e.currentTarget.dataset.flag === '4') {
      that.setData({
        ['form.mqtt_password']: e.detail.value
      })
    }
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
    if (wx.getStorageSync('news')) {
      that.data.form = wx.getStorageSync('news');
    }

    if (wx.getStorageSync('tempFilePath')) {
      that.data.tempFilePath = wx.getStorageSync('tempFilePath');
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    let data = that.data.form;
    wx.setStorageSync('news', data);
    wx.setStorageSync('tempFilePath', that.data.tempFilePath);
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
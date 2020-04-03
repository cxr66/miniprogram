// pages/mission/news/news.js
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
      title: '',
      link: '',
      pic_url: ''
    },
    tempFilePath: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    var date1 = new Date(),
      time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();
    that.setData({
      begin_date: time1
    })
    wx.showToast({
      title: '所有都为必填项',
    })
  },

  /* 图片上传 */
  upload() {
    wx.chooseImage({
      count: 1, //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        that.setData({
          tempFilePath: tempFilePaths
        })
      }
    })
  },
  /* 新增新闻 */
  confirm() {
    let url = app.globalData.url_online.url_9102 + 'system/wechat/add_news_center/';

    if (that.data.form.title && that.data.form.link) {
      wx.showLoading({
        title: '',
        mask: true
      })
      wx.uploadFile({
        url: 'https://oss.crowncrystalhotel.com/resource/wechatNews/upload',
        filePath: that.data.tempFilePath[0],
        name: 'wechat',
        header: {
          'authorization': app.globalData.codeInfo.new_authorization
        },
        success(res) { 
          if (JSON.parse(res.data).message == 'success') {
            http.postReq(url, {
              "title": that.data.form.title,
              "title_date": that.data.begin_date,
              "link_url": that.data.form.link,
              "pic_url": JSON.parse(res.data).complete,
              "remark": new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + "上传"
            }, function(res) { 
              wx.hideLoading();
              wx.showToast({
                title: '保存成功',
              })  
              
              wx.removeStorageSync('tempFilePath');
              wx.removeStorageSync('news');
            });
          } else {
            wx.showToast({
              title: '上传图片失败' + res.message,
            })
          }
        }
      })
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
    if (e.currentTarget.dataset.flag == '0') {
      that.setData({
        ['form.title']: e.detail.value
      })
    } else if (e.currentTarget.dataset.flag == '1') {
      that.setData({
        ['form.link']: e.detail.value
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
    if (wx.getStorageSync('news')){
      that.data.form = wx.getStorageSync('news');
    }

    if (wx.getStorageSync('tempFilePath')){
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
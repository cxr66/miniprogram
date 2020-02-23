// pages/my/setting/setting.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      infoList: [
        {
          code: '消息提醒',
        bind: ''
        },
        /* {
          code: '账户安全',
          link: '',
          bind: ''
        }, */
        {
          code: '用户反馈',
          link: '',
          bind: ''
        },
        {
          code: '清除缓存',
          link: '',
          bind: 'clearStorage'
        },
        {
          code: '客服电话',
          desc: '13812345678',
          bind: ''
        }
      ]
    })
  },
  navigate(e) {
    let link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link,
    })
  },
  redirect(e) {
    let link = e.currentTarget.dataset.link;
    wx.redirectTo({
      url: link,
    })
  },
  reLaunch(e){
    let link = e.currentTarget.dataset.link;
    wx.reLaunch({
      url: link,
    })
  },
  /* 清除缓存 */
  clearStorage(){
    wx.clearStorage({
      success(res) {
        wx.showToast({
          title: '清除成功',
          icon: 'none'
        })
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

  }
})
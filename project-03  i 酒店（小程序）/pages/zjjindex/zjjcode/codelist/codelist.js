// pages/zjjindex/zjjcode/codelist/codelist.js
const app = getApp();
const http = require('../../../../utils/http'); 
var that = undefined;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /* tab栏 */
    menuList: [{
      name: "房价码列表"
    }],
    tabScroll: 0,
    currentTab: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.getSystemInfo({ // 获取当前设备的宽高
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })

    that.get_all_reserve_info(options.api_url,options.teamNo,options.machine_uuid);
  },
/**
   * @get_all_reserve_info/ 查询团队
   */
  get_all_reserve_info(api_url,teamNo,machine_uuid){
    let url = api_url +'get_all_reserve_info/',params = {
      "ValueType":"1",
      "Value": teamNo,
      "machine_uuid":machine_uuid
    }
  
    http.postReq(url,params,function(res){
      console.log(res.data); 
      if(res.message=='success'){
        that.setData({codeList:res.data.room_detail})
      }
      
    });
  },
  // 跳转
  navigate: function (e) {
    let link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link
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
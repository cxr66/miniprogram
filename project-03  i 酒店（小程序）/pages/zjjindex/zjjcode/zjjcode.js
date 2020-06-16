// pages/zjjindex/zjjcode/zjjcode.js
const app = getApp();
const http = require('../../../utils/http');
var inputValue,that = undefined;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue: "",
    confirmFlag:false,
  },

  bindKeyInput:function(e){
    inputValue= e.detail.value;
  },

  showQrCode:function(e){
    wx.navigateTo({
      url: '/pages/zjjindex/zjjcanvas/zjjcanvas?inputValue='+inputValue,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let url = app.globalData.url_online.url_machine + 'manager_back/get_main_list/?hotel_id='+app.globalData.userInfo.hotel_id+'&page_size=999'
    http.getReq(url,function(res){
      console.log(res.data);
      that.setData({machineList: res.data.results});
    });

    that.get_hotel_settings_list();
  },
  /**
   * @get_hotel_settings_list 查询可用团队域名
   */
  get_hotel_settings_list(){
    let url = app.globalData.url_online.url_machine +'manager_front/get_hotel_settings_list?page_size=999',params = {
      "param_type": 8,
      "hotel_id": app.globalData.userInfo.hotel_id,
      "hotel_group_id": app.globalData.userInfo.hotel_group_id,
    }
    http.getDataReq(url,params,function(res){
      console.log(res.data); 

      for (let item of res.data.results) {
        if(item.param_id_str==='Ispider_pms_url'){
          console.log(item.param_value); 
          that.setData({ api_url : item.param_value })
        }
      }
    });
  },
  /**
   * @get_all_reserve_info/ 查询团队
   */
  get_all_reserve_info(){
    let url = that.data.api_url +'get_all_reserve_info/',params = {
      "ValueType":"1",
      "Value": inputValue,
      "machine_uuid":that.data.machineList[0].machine_uuid
    }
  
    http.postReq(url,params,function(res){
      console.log(res.data); 
      if(res.message=='success'&&res.data.room_detail.length){
        wx.navigateTo({
          url: '/pages/zjjindex/zjjcode/codelist/codelist?teamNo='+inputValue+'&machine_uuid='+that.data.machineList[0].machine_uuid+'&api_url='+that.data.api_url,
        })
      }
      
    });
  },
  // 跳转
  navigate: function (e) {
    let link = e.currentTarget.dataset.link, desc = e.currentTarget.dataset.desc;
    AudioContext.AudioContext(desc);
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
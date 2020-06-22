// pages/opeindex/zjjsetting/zjjsetting.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
const prom = require('../../../utils/prom.js');
const AudioContext = require('../../../utils/AudioContext.js');
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
    that = this;
    that.get_machine_list();
  },
  /** *
   * @get_machine_list 获取自助机列表
    */
  get_machine_list(){
    wx.showLoading();
    http.getReq(app.globalData.url_online.url_machine + 'manager_back/get_main_list/?page_size=300', function (res) {
      wx.hideLoading();
      console.log('获取自助机列表', res);
      that.setData({
        machineList: res.data.results
      })
    });
  },
  // 跳转
  navigate: function (e) {
    let link = e.currentTarget.dataset.link,
      id = e.currentTarget.dataset.id;; 
    wx.navigateTo({
      url: link+'?id='+id
    })
  },
  switchChange: function(e) {
    // that.setData({
    //   // ['form.isChecked']: e.detail.value
    // })

    console.log(e.detail.value);
    let state ,desc = e.currentTarget.dataset.desc,uuid = e.currentTarget.dataset.uuid;
    console.log(uuid);
    if(e.detail.value){
      state = 1;
      desc=desc+'正式环境';
    }else{
      state = 2;
      desc=desc+'测试环境';
    }
    
    that.update_machine(e.currentTarget.dataset.id,state,desc,uuid);
  },
  /** *
   * @update_machine
    */
   update_machine(id,state,desc,uuid){  
    http.postReq(app.globalData.url_online.url_machine_eload + 'manager_back/update_main/'+id+'/', {
      'environmental_state':state
    },function (res) {
      console.log('更改自助机配置', res);
      wx.showToast({
        title: '更改成功',  
        icon: 'none', 
        mask: true, 
      })
      that.get_machine_list();
      that.add_machine_update_desc(desc,uuid);
    });
   },
   /** *
   * @add_machine_update_desc
    */
   add_machine_update_desc(desc,uuid){  
    http.postReq(app.globalData.url_online.url_machine_eload + 'manager_front/add_settings_record/', {
      'desp' : desc,
      'machine_uuid' : uuid
    },function (res) {
      console.log('添加记录成功', res);

    });
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
    wx.stopPullDownRefresh();
    that.get_machine_list();
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
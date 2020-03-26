// pages/opeindex/opetest/opetestlist/opetestlist.js
var app = getApp();
var that = undefined;
const http = require('../../../../utils/http.js');
const prom = require('../../../../utils/prom.js');
const AudioContext = require('../../../../utils/AudioContext.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    machine_modal: true,
    arIndex: 0,

    purpose_modal: false,
    purIndex: 0,
    purposeList: [{
      id: 1,
      desc: '自助机'
      },
      {
        id: 2,
        desc: 'PMS'
      },
      {
        id: 3,
        desc: '硬件'
      },
      {
        id: 4,
        desc: '其他'
      }
    ],

    checkIndex: 0,
    CheckList: [{
      desc: '所有'
    }, {
      id: 0,
      desc: '待测'
    },
    {
      id: 1,
      desc: '正常'
    },
    {
      id: 2,
      desc: '异常'
    }

    ],
  },
  // 设备态筛选
  bindPickerChange: function(e) {
    let value = parseInt(e.detail.value),url;
    that.setData({
      checkIndex: parseInt(e.detail.value)
    })
    console.log('驻存的路由', that.data.routeUrl);
    if (that.data.CheckList[parseInt(e.detail.value)].desc == '所有') {
     
      that.get_all_by_routeUrl(that.data.routeUrl);

    }else{
     
      url = that.data.routeUrl+'&feedback_type=' + that.data.CheckList[that.data.checkIndex].id ;
      console.log(url);
      wx.showLoading({});
      http.getReq(url, function (res) {
        wx.hideLoading();
        console.log('筛选后的测试用例列表', res.data.results);

        that.setData({
          testList: res.data.results
        })
      }); 
    }
  },
  /* 通过对象来获取测试用例列表 */
  get_by_purpose(){
    var url;
    if (that.data.purposeList[that.data.purIndex].desc == '自助机'){
      that.setData({
        machine_modal: false,
        purpose_modal: true,
        checkIndex: 0,
      })
    }else{
      that.setData({ 
        checkIndex: 0,
        purpose_modal: true
      })
      url = app.globalData.url_online.url_9102 + 'task/ticket_service/hotel_get_test_case_feedback_list/?purpose=' + that.data.purposeList[that.data.purIndex].id
      wx.showLoading({});
      http.getReq(url, function (res) {
        wx.hideLoading();
        console.log('筛选后的测试用例列表', res.data.results);

        that.setData({
          routeUrl: url,
          testList: res.data.results
        })
      });
    }
  },
  /* 
    获取一个酒店下自助机
   */
  get_machine_by_hotelid(hotel_id) {
    let url = app.globalData.url_online.url_machine + 'manager_back/get_main_list/?hotel_id=' + hotel_id;
    http.getReq(url, function(res) {

      console.log('获取酒店自助机列表', res.data);
      that.setData({
        machineList: res.data.results
      })
    });
  },
  machine_modal(){
    that.setData({
      machine_modal: !that.data.machine_modal,
      purpose_modal: false
    })
  },
  display_modal(e) {
    if (e.currentTarget.dataset.modal == 'machine'){
      that.setData({
        machine_modal: !that.data.machine_modal
      })
    } else if (e.currentTarget.dataset.modal == 'purpose'){
      that.setData({
        purpose_modal: !that.data.purpose_modal
      })
    }
    
  },
  bindMachineChange(e) { 
    if (e.currentTarget.dataset.flag == 'machine') {
      that.setData({
        arIndex: e.detail.value
      })
    } else if (e.currentTarget.dataset.flag == 'purpose') {
      that.setData({
        purIndex: e.detail.value
      })
    }   
  },
  /* 
    根据自助机获取测试用例
   */
  get_testlist_by_machine() { 
    if (that.data.machineList[that.data.arIndex].id) {
      var url = app.globalData.url_online.url_9102 + 'task/ticket_service/hotel_get_test_case_feedback_list/?machine_id=' + that.data.machineList[that.data.arIndex].id + '&purpose=' + that.data.purposeList[that.data.purIndex].id;
      
      http.getReq(url, function(res) {
        wx.hideLoading();
        console.log('筛选后的测试用例列表', res.data.results);
 
        that.setData({
          testList: res.data.results,
          machine_modal: true,
          routeUrl: url,
        })
      });
    } else {
      wx.showToast({
        title: '请选择一个自助机',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    that.get_machine_by_hotelid(app.globalData.userInfo.hotel_id);
  },
  // 跳转
  navigate: function(e) {
    let link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link
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
  /* 获取全部测试用例 */
  get_all_by_routeUrl(routeUrl) {
    wx.showLoading({});
    http.getReq(routeUrl, function(res) {
      wx.hideLoading();
      console.log('测试用例列表', res.data.results);
      that.setData({
        testList: res.data.results
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
    wx.stopPullDownRefresh();
    that.onLoad();
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
// pages/mission/clean/cleanList/cleanList.js
var app = getApp();
var that = undefined;
const http = require('../../../../utils/http.js');
const prom = require('../../../../utils/prom.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 员工人员
    employeeList: [],
    chooseIndex: 0, //对应的函数：bindPickerchange;
    modal_flag: true, //蒙层
    // 详细订单
    cleanList: [],

    // 当前选中的任务id
    rightId: ''
  },
  // 选择房务人员
  bindPickerChange(e) {
    this.setData({
      chooseIndex: e.detail.value
    })
  },
  cancle_modal_flag(e) {
    if (e.currentTarget.dataset.id) {
      that.setData({
        rightId: e.currentTarget.dataset.id,
        room_no: e.currentTarget.dataset.roomno
      })
    }
    that.setData({
      modal_flag: !that.data.modal_flag
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    wx.showLoading({
      title: '',
      mask: true
    })
    // 获取所有送物
    that.get_all_sweep();
    // 获取所有员工列表
    that.get_all_employee_list();

  },

  /* 
    跳转函数
   */
  navigate(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  /*
   送物列表 
   */
  get_all_sweep() {
    http.getReq(app.globalData.url_online.url_9104 + 'room_service/get_sweep_list/', function(res) {

      console.log('获取打扫任务列表', res.data);
      that.setData({
        cleanList: res.data.results
      })
      wx.hideLoading();
    });
  },
  /* 
    获取所有员工列表 
  */
  get_all_employee_list() {
    let url = app.globalData.url_online.url_login + 'common/employee/info_list';
    http.getReq(url, function(res) {
      console.log('获取所有员工列表', res.data);
      that.setData({
        employeeList: res.data.list
      })
    });
  },
  /* 
    确定分配任务
  */
  confirm() {
    that.setData({
      modal_flag: !that.data.modal_flag
    })

    // 更新送物任务的员工 
    that.assign_update_sweep(that.data.rightId, that.data.employeeList[that.data.chooseIndex].id);
  },

  /* 
    任务完成更新 
  */
  company_accomplish(e) {
    // 分配成功后更新任务状态
    that.company_update_sweep(e.currentTarget.dataset.id, 10);
  },
  /* 
  更新送物任务的员工 
  */
  assign_update_sweep(id, work_user_id) {
    let url = app.globalData.url_online.url_9104 + 'room_service/assign_update_sweep/' + id + '/',
      params = {
        room_no: that.data.room_no,
        work_user_id: work_user_id,
        remark: '分配给' + that.data.employeeList[that.data.chooseIndex].real_name + '打扫任务'
      };
    http.postReq(url, params, function(res) {
      console.log(res.data);
      if (res.message == 'success') {
        wx.showToast({
          title: '分配成功',
          icon: 'none'
        })
        // 获取所有送物
        that.get_all_sweep();

      } else {
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    });
  },
  /* 
    更新送物任务的状态 
  */
  company_update_sweep(id, status) {

    let url = app.globalData.url_online.url_9104 + 'room_service/company_update_sweep/' + id + '/',
      params = {
        status: status,
        remark: '更新id为' + id + '的任务'
      };
    http.postReq(url, params, function(res) {
      console.log(res.data);
      if (res.message == 'success') {
        wx.showToast({
          title: '状态修改成功',
          icon: 'none'
        })

        // 获取所有送物
        that.get_all_sweep();
      } else {
        wx.showToast({
          title: '打扫失败',
          icon: 'none'
        })
      }
    });
  },

  have_pass() {
    wx.showToast({
      title: '已打扫完成',
      icon: 'none'
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
    // 获取所有送物
    that.get_all_sweep();
    wx.stopPullDownRefresh();
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
// pages/mission/engineer/engineer.js 
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
const prom = require('../../../utils/prom.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 员工人员
    employeeList: [],
    chooseIndex: 0, //对应的函数：bindPickerchange;
    modal_flag: true, //蒙层
    new_flag: true,
    // 详细订单
    goodsList: [],

    // 当前选中的任务id
    rightId: ''
  },
  /* 
    ** 新建送物任务
   */
  showNewModal(e) {
    this.setData({
      new_flag: !that.data.new_flag
    })
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
        rightId: e.currentTarget.dataset.id
      })
    }
    that.setData({
      modal_flag: !that.data.modal_flag
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    /* 任务ID */
    /*
    if(options.id){
      that.setData({
        misId: options.id
      })
    }
     if (options.user_info) {
      let userPwd = options.user_info.split(',');
      wx.request({
        url: app.globalData.url_online.url_login + 'common/employee/login', //服务接口地址
        method: 'post',
        data: {
          'code': userPwd[2],
          'user_name': userPwd[0],
          'password': userPwd[1],
        },
        success: function (res) {
          console.log(res.data);
          if (res.data.message === 'success') {
            wx.setStorageSync('codeInfo', res.data);
            app.globalData.codeInfo = res.data;
            wx.setStorageSync('userInfo', res.data.user_info);
            app.globalData.userInfo = res.data.user_info;

            wx.hideLoading();
            // 获取所有送物
            http.getReq(app.globalData.url_online.url_9104 + 'room_service/get_delivery_info/' + misId +'/', function (res) {
              for (let i in res.data.results) {
                res.data.results[i].goods_list = JSON.parse(res.data.results[i].goods_list);
              }
              console.log('根据id获取单个送物任务', res.data.results); 
              that.setData({
                goodsList: res.data.results
              })
            }); 
          } else {
            wx.showToast({
              title: '登录失败',
              icon: 'none'
            })
          }
        },
        fail: function () {
        }
      })

    } else { 
      wx.showLoading({
        title: '',
        mask: true
      })
      // 获取所有送物
      that.get_all_good();
      // 获取所有员工列表
      that.get_all_employee_list();
    }*/
  },
  /*
   送物列表 
   */
  get_all_good() {
    http.getReq(app.globalData.url_online.url_9104 + 'room_service/get_delivery_list/', function (res) {
      for (let i in res.data.results) {
        res.data.results[i].goods_list = JSON.parse(res.data.results[i].goods_list);
      }
      console.log('获取所有送物列表', res.data.results);
      that.setData({
        goodsList: res.data.results
      })
      wx.hideLoading();
    });
  },
  /* 
    获取所有员工列表 
  */
  get_all_employee_list() {
    let url = app.globalData.url_online.url_login + 'common/employee/info_list';
    http.getReq(url, function (res) {
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
    that.assign_update_delivery(that.data.rightId, that.data.employeeList[that.data.chooseIndex].id);
  },

  /* 
    任务完成更新 
  */
  company_accomplish(e) {

    // 分配成功后更新任务状态
    that.company_update_delivery(e.currentTarget.dataset.id, 10);
  },
  /* 
  更新送物任务的员工 
  */
  assign_update_delivery(id, work_user_id) {
    let url = app.globalData.url_online.url_9104 + 'room_service/assign_update_delivery/' + id + '/',
      params = {
        work_user_id: work_user_id,
        remark: '分配给' + that.data.employeeList[that.data.chooseIndex].real_name + '送物任务'
      };
    http.postReq(url, params, function (res) {
      console.log(res.data);
      if (res.message == 'success') {
        wx.showToast({
          title: '分配成功',
          icon: 'none'
        })
        // 获取所有送物
        that.get_all_good();
        // 分配成功后更新任务状态
        // that.company_update_delivery(id, 5);
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
  company_update_delivery(id, status) {
    let url = app.globalData.url_online.url_9104 + 'room_service/company_update_delivery/' + id + '/',
      params = {
        status: status,
        remark: '更新id为' + id + '的任务'
      };
    http.postReq(url, params, function (res) {
      console.log(res.data);
      if (res.message == 'success') {
        wx.showToast({
          title: '配送状态修改成功',
          icon: 'none'
        })

        // 获取所有送物
        that.get_all_good();
      } else {
        wx.showToast({
          title: '配送失败',
          icon: 'none'
        })
      }
    });
  },

  have_pass() {
    wx.showToast({
      title: '已配送完成',
      icon: 'none'
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
    wx.showLoading({
      title: '',
      mask: true
    })
    // 获取所有送物
    that.get_all_good();
    // 获取所有员工列表
    that.get_all_employee_list();
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
    // 获取所有送物
    that.get_all_good();
    wx.stopPullDownRefresh();
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
  /* 
   * 跳转函数
   */
  navigate(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link,
    })
  }
})
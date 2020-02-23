// pages/mission/goods/goodsDetail/goodsDetail.js
var app = getApp();
var that = undefined;
const http = require('../../../../utils/http.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 固定定位按钮
    btn_group: [
      {
        desc: '未完成',
        bind: 'nopass'
      },
      {
        desc: '完成',
        bind: 'company_accomplish'
      }
    ],
    // 详细
    checkList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    if (options.room_no) {
      that.setData({
        "room_no": options.room_no
      })
    }
    // 任务id
    if (options.id) {
      that.setData({
        "MId": options.id
      })
    }

    wx.showLoading({
      title: '',
      mask: true
    })
    if (options.user_info) {
      let userPwd = options.user_info.split(',');

      that.setData({
        user_info: options.user_info
      })
      
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
            let checkDetail = [];
            // 获取需要查询的物品
            http.getReq(app.globalData.url_online.url_9104 + 'room_service/get_delivery_info/' + that.data.MId + '/', function (res) {
              console.log('查询送物单个id详情', res.data);
              res.data.goods_list = JSON.parse(res.data.goods_list);
              that.setData({
                goodsList: res.data
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
      let checkDetail = [];
      // 获取需要查询的物品
      http.getReq(app.globalData.url_online.url_9104 + 'room_service/get_delivery_info/' + that.data.MId + '/', function (res) {
        console.log('查询送物单个id详情', res.data);
        wx.hideLoading();
        res.data.goods_list = JSON.parse(res.data.goods_list);
        that.setData({
          goodsList: res.data
        })
      });
    }


  },
  nopass(e) {
    wx.showToast({
      title: '送物未完成',
      icon: 'none'
    })
  },
  /* 
    任务完成更新 
  */
  company_accomplish(e) {
    
    // 分配成功后更新任务状态
    that.company_update_delivery(that.data.MId, 10);
  },
  /* 
    更新送物任务的状态 
  */
  company_update_delivery(id, status) {

    let url = app.globalData.url_online.url_9104 + 'room_service/company_update_delivery/' + id + '/',
      params = {
        status: status,
        remark: '房间' + that.data.room_no + '送物任务完成'
      };
    http.postReq(url, params, function (res) {
      console.log(res.data);
      if (res.message == 'success') {
        wx.showToast({
          title: '送物任务完成',
          icon: 'none'
        })

        if (that.data.user_info) {
          wx.reLaunch({
            url: '/pages/logins/logins',
          })
        } else {
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 500)
        }
      } else {
        wx.showToast({
          title: '送物任务未完成',
          icon: 'none'
        })
      }
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

})
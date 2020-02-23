// pages/mission/bus/bus.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
const prom = require('../../../utils/prom.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modal_flag: true,
    // 详细订单
    goodsList: [],

    // 班车类型
    busIndex:0,
    busArray:[
      {
        code: 10,
        descript: '班车'
      },
      {
        code: 20,
        descript: '专车'
      }
    ]
  },
  // 选择房务人员
  bindPickerChange(e) {
    console.log(e.detail.value);
    if ( e.currentTarget.dataset.flag  == '0' ){
      that.setData({
        busIndex: e.detail.value
      })
    } else if (e.currentTarget.dataset.flag == '1'){
      that.setData({
        staffIndex: e.detail.value
      })
    }
  },
  // textarea失去焦点
  bindTextAreaBlur(e) {
    console.log(e.detail.value);
    that.setData({
      remark: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    // 班车
    http.getReq(app.globalData.url_online.url_9104 + 'room_service/regular_bus/get_rs_regular_bus_list/', function(res) {
      console.log(res.data.results);
      that.setData({
        goodsList: res.data.results
      })
    });
  },
  edit_bus(e){
    let post_item = e.currentTarget.dataset.item;
    that.setData({
      modal_flag: false,
      post_item: post_item
    })
  },
  // 取消弹窗
  cancle_bus(e) {
    that.setData({
      modal_flag: true
    })
  },
  // 更改接待状态
  update_bus() {
    let post_item = that.data.post_item,
    id = post_item.id;
    post_item.status = 20;

    delete post_item.id;

    delete post_item.create_user;

    delete post_item.create_datetime;

    delete post_item.modify_user;
    
    delete post_item.modify_datetime;

    console.log(post_item);
    // 更改房态信息
    http.postReq(app.globalData.url_online.url_9104 + 'room_service/regular_bus/update_rs_regular_bus/' + id +'/', post_item, function(res) {
      console.log(res.data);
      if (res.message == 'success') {
        wx.showToast({
          title: '接待成功',
          icon: 'none'
        })

        that.cancle_bus();
        // 班车
        http.getReq(app.globalData.url_online.url_9104 + 'room_service/regular_bus/get_rs_regular_bus_list/', function (res) {
          console.log(res.data.results);
          that.setData({
            goodsList: res.data.results
          })

        });
      } else {
        wx.showToast({
          title: '更新失败',
          icon: 'none'
        })
      }

    });
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
    let post_data = {
      hotel_group_id: 4,
      hotel_id: 6,
      duty_ids: JSON.stringify([2]),
      page_size: 300,
      page_num: 1
    }

    http.postReq('http://47.98.113.173:9519/v1/common/employee/get_by_duty', post_data, function (res) {
      console.log(res.data);
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
// pages/place/place.js
var app = getApp(),
  that = undefined;
const http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  }, 
  /* 获取所有的会议厅列表 */
  get_place_list() {
    let url = app.globalData.url_online.url_9503 + 'meeting/hall/list';
    http.postReq(url,{}, function(res) {
      console.log(res);
      that.setData({
        ['eqCheckList[' + 0 +'].list']: res.data.list
      }) 
    });
  },
  /* 获取默认所有的会议厅当天情况*/
  get_all_meeting_today() {
    let url = app.globalData.url_online.url_9503 + 'meeting/base/show_today';
    http.getReq(url , function (res) {
      console.log('当天所有会议厅占用情况',res.data);
      that.setData({
        show_today_list: res.data
      })
    });
  },
  /* 获取默认占用状态列表*/
  get_all_meeting(params) {
    let url = app.globalData.url_online.url_9503 + 'meeting/base/search_occupied';
    // params = {
    //   "from_time": "2019-05-05 12:34:56",
    //   "days": 30
    // }
    http.postReq(url, params, function (res) {
      console.log('获取默认占用状态列表', res);

    });
  },
  /* 获取某一个厅的会议信息 */
  get_meeting_by_id(params) {
    let url = app.globalData.url_online.url_9503 + 'meeting/base/get_by_hall';
    http.postReq(url, params, function(res) {
      console.log('某一个厅一段时间的会议情况',res.data);
      wx.showToast({
        title: '刷新成功',
        icon: 'none'
      })
      that.setData({
        placeList: res.data
      })
    });
  },

  // 时间选择器
  bindDateChange(e) {
    if (e.currentTarget.dataset.flag == '0') {
      that.setData({
        hall_id: that.data.eqCheckList[0].list[e.detail.value].id,
        ['eqCheckList[' + 0 + '].name']: that.data.eqCheckList[0].list[e.detail.value].hall_name,
      })
    } else if(e.currentTarget.dataset.flag == '1'){
      that.setData({
        begin_date: e.detail.value,
        ['eqCheckList[' + 1 + '].name']: e.detail.value
      })
    }else{
      that.setData({
        end_date: e.detail.value,
        ['eqCheckList[' + 2 + '].name']: e.detail.value
      })
    } 
    if (that.data.hall_id){
      let params = {
        "hall_id": parseInt(that.data.hall_id),
        "from_date": that.data.begin_date,
        "to_date": that.data.end_date
      };
      that.get_meeting_by_id(params);
    }else{
      wx.showToast({
        title: '未选中任何会议厅',
        icon: 'none'
      })
    }
    
    
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    that = this;

    
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
    var date = new Date();
    var Y = date.getFullYear();
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    that.setData({
      begin_date: Y + '-' + M + '-' + D,
      end_date: Y + '-' + M + '-' + D,
      // 筛选条件
      eqCheckList: [{
        name: '会场筛选',
        list: []
      },
      {
        name: '起始时间筛选',
        list: []
      },
      {
        name: '终止时间筛选',
        list: []
      }
      ], 
      hall_id: ''
    })
    // 所有的会议厅列表
    that.get_place_list();

    // 获取默认占用状态列表
    that.get_all_meeting({
      "from_time": Y + '-' + M + '-' + D + " 12:34:56",
      "days": 30
    });

    // 获取当天会议情况
    that.get_all_meeting_today();
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
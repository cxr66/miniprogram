// pages/index/statusrecord/statusrecord.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    that.setData({
      /* 筛选条件 */
      check_index: -1,
      check_list: [{
        name: '起始时间',
        checked: true,
        list: []
      },
      {
        name: '结束时间',
        checked: false,
        list: []
      },
      {
        name: '起始房态',
        checked: false,
        list: []
      },
      {
        name: '结束房态',
        checked: false,
        list: []
      }
      ],
      room_change_list: [],

      // 筛选条件的起始时间
      begin_date: '',
      end_date: '',
      begin_status: '',
      end_status: '',
    })
    that.get_room_status();

    http.getReq(app.globalData.url_online.url_9101 + 'room_status/get_room_status_change_list/?page_size=999', function(res) {
      let results = res.data.results;
      for (let i in results){
        results[i].start_time = results[i].start_time.split('T')[0] + ' ' + results[i].start_time.split('T')[1].split('.')[0];
        results[i].end_time = results[i].end_time.split('T')[0] + ' ' + results[i].end_time.split('T')[1].split('.')[0];
      }
      that.setData({
        room_change_list: results
      })
    });
    
    /* let url = app.globalData.url_online.url_9101 + 'room_status/get_room_status_change_list/?start_time__range=2019-05-01,2020-10-10&room_state_before_code=VC' */
  },
  get_room_status() {
    // 状态筛选
    http.getReq(app.globalData.url_online.url_9101 + 'room_status/get_code_room_state_list/', function(res) {
      console.log('状态筛选', res.data);
      that.setData({
        room_status: res.data.results,
        ['check_list[' + 2 + '].list']: res.data.results,
        ['check_list[' + 3 + '].list']: res.data.results
      })
    });
  },
  /* 
       时间选择器 
    */
  bindDateChange(e) {
    if (e.currentTarget.dataset.flag == '0') {
      this.setData({
        begin_date: e.detail.value,
        ["check_list[" + 0 + "].name"]: e.detail.value,
      })
    } else if (e.currentTarget.dataset.flag == '1') {
      this.setData({
        end_date: e.detail.value,
        ["check_list[" + 1 + "].name"]: e.detail.value,
      })
    } else if (e.currentTarget.dataset.flag == '2') {
      this.setData({
        begin_status: that.data.room_status[e.detail.value].code,
        ["check_list[" + 2 + "].name"]: that.data.room_status[e.detail.value].desc,
      })
    } else if (e.currentTarget.dataset.flag == '3') {
      this.setData({
        end_status: that.data.room_status[e.detail.value].code,
        ["check_list[" + 3 + "].name"]: that.data.room_status[e.detail.value].desc,
      })
    }
    console.log(that.data.begin_date);
    console.log(that.data.end_date);
    console.log(that.data.begin_status);
    console.log(that.data.end_status);

    if (that.data.begin_date){

    }
    let url = app.globalData.url_online.url_9101 + 'room_status/get_room_status_change_list/?start_time__range=' + that.data.begin_date + ',' + that.data.end_date + '&room_state_before_code=' + that.data.begin_status + '&room_state_after_code=' + that.data.end_status;
    http.getReq(url, function (res) { 
      that.setData({
        room_change_list: res.data.results
      })
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
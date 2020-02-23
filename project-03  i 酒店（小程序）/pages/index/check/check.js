// pages/i ndex/check/check.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
const prom = require('../../../utils/prom.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 固定定位按钮
    btn_group: [
      {
        desc: '不通过',
        bind: 'nopass'
      },
      {
        desc: '通过',
        bind: 'havepass'
      }
      
    ],
    // 详细
    checkList: [ ]
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    that = this;
    that.setData({
      "room_no": options.room_no
    })

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
            http.getReq(app.globalData.url_online.url_9103 + 'system/settings/get_code_room_check_content_list/', function (res) {
              console.log('查询条件', res.data);

              for (let i in res.data.results) {
                for (let j in res.data.results[i].child_list) {
                  res.data.results[i].child_list[j].checked = false;

                  // 查房内容详情
                  let checkItem = { "id": res.data.results[i].child_list[j].id, "name": res.data.results[i].child_list[j].desc, "num": 1, "code": res.data.results[i].child_list[j].code, "score": 0 };
                  checkDetail.push(checkItem);
                }
              }
              that.setData({
                checkList: res.data.results,
                checkDetail: checkDetail
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
      http.getReq(app.globalData.url_online.url_9103 + 'system/settings/get_code_room_check_content_list/', function (res) {
        console.log('查询条件', res.data); 
        wx.hideLoading();
        for (let i in res.data.results) {
          for (let j in res.data.results[i].child_list) {
            res.data.results[i].child_list[j].checked = false;

            // 查房内容详情
            let checkItem = { "id": res.data.results[i].child_list[j].id, "name": res.data.results[i].child_list[j].desc, "num": 1, "code": res.data.results[i].child_list[j].code, "score": 0 };

            checkDetail.push(checkItem);
          }
        }


        that.setData({
          checkList: res.data.results,
          checkDetail: checkDetail
        })


      });
    }

    
  },
  nopass(e){
    wx.showToast({
      title: '查房不通过',
      icon: 'none'
    })
  },
  havepass(e){
    let url = app.globalData.url_online.url_9104 + 'room_service/update_room_check/';
    http.postReq(url, {
      "room_no": that.data.room_no,
      "check_detail": JSON.stringify(that.data.checkDetail) ,
      "consume_detail": [{ "id": 1, "name": "矿泉水", "num": 1, "price": 10 }, { "id": 2, "name": "方便面", "num": 2, "price": 20 }],
    }, function (res) {
      wx.showToast({
        title: '查房成功',
        icon: 'success'
      })
      console.log('查房', res.data);
      if (that.data.user_info){
        wx.reLaunch({
          url: '/pages/logins/logins',
        })
      }else{
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 500)
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
  checkboxChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);
    let checkArray = e.detail.value;
    let checkList = that.data.checkList;
    let checkDetail = [];
    
      for (let i in checkList) {
        for (let j in checkList[i].child_list) {
          let checkItem = { "id": checkList[i].child_list[j].id, "name": checkList[i].child_list[j].desc, "num": 1, "code": checkList[i].child_list[j].code, "score": 0 }; 
          for (let m in checkArray) {
          
            if (checkArray[m] == checkList[i].child_list[j].code){ 
              checkItem.score = 1;

            }
          }
          checkDetail.push(checkItem);
      }
    }
    console.log(checkDetail);
    that.setData({
      checkDetail: checkDetail
    })
  }
})
// pages/my/sign/sign.js
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
    ifflag: true,
    classArray: ['美国', '中国', '巴西', '日本'],
    classIndex: 0,
    locate: '',
    schedule: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;

    var date = new Date();
    var Y = date.getFullYear();
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

    this.setData({
      infoList: [{
          code: '姓名',
          desc: app.globalData.codeInfo.real_name
        },
        {
          code: '账号',
          desc: app.globalData.userInfo.user_name
        },
        {
          code: '班次',
          desc: ''
        },
        {
          code: '签到日期',
          desc: Y + '-' + M + '-' + D
        },
        {
          code: '签到时间',
          desc: date.getHours() + ':' + date.getMinutes()
        },
        {
          code: '所属部门',
          desc: app.globalData.userInfo.real_name
        },
        {
          code: '我的身份',
          desc: app.globalData.userInfo.real_name
        },
        {
          code: '地点',
          desc: ''
        }
      ],
      now_date: Y + '-' + M + '-' + D
    })
    that.locate();
    let postData = {
      from_date: Y + '-' + M + '-' + D,
      to_date: Y + '-' + M + '-' + D
    }
    // 获取所有班次信息
    that.get_schedule();

    // 获取签到信息
    http.postReq(app.globalData.url_online.url_9503 + 'manage/duty_record/list', postData, function(res) {
      console.log('获取签到信息', res.data);

      if (res.data.length && res.data[res.data.length - 1].duty_date == (Y + '-' + M + '-' + D)) {
        that.setData({
          ifflag: false
        })
      }
    });

    
  },

  get_schedule() {
    let url = app.globalData.url_online.url_9503 + 'manage/duty_schedule/hotel_schedules',
      params = {
        'user_id': app.globalData.userInfo.user_id,
        'from_date': that.data.now_date,
        'to_date': that.data.now_date
      };
      wx.showLoading({
        title: '',
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    http.postReq(url, params, function(res) {
      console.log('班次', res.data.list[0].shifts[0][that.data.now_date]);
      if (res.data.list[0].shifts[0]){
        that.setData({
          schedule: res.data.list[0].shifts[0][that.data.now_date]
        })
        wx.hideLoading();
      }else{
        wx,wx.showToast({
          title: '当前用户没有班次',
          icon: 'none',
        })
      }
    });
  },
  // 选择签到班次
  bindPickerChange(e) {
    this.setData({
      classIndex: e.detail.value
    })
  },
  // 签到按钮
  sign_in() {
    let currentTime = that.get_time();
    AudioContext.AudioContext('签到');
    wx.scanCode({
      onlyFromCamera: true,
      success(res){
        console.log(res)
      }
    })
    if (that.data.schedule) {
      
      let postData = {
        check_in_or_out: 0,
        duty_time: currentTime,
        duty_place: that.data.locate,
        shift_id: that.data.schedule.id,
        duty_type_id: '0',
        lat: that.data.latitude,
        lon: that.data.longitude,
      }
      http.postReq(app.globalData.url_online.url_9503 + 'manage/duty_record/add', postData, function(res) {
        // console.log(res.data);
        if (res.message == 'success') {
          that.setData({
            ifflag: false
          })
          wx.showToast({
            title: '签到成功',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '签到失败',
            icon: 'none'
          })
        }

      });
    } else {
      wx.showToast({
        title: '当前没有班次信息',
        icon: 'none'
      })
    }
  },
  // 签退按钮
  sign_out() {
    let currentTime = that.get_time();
    AudioContext.AudioContext('签退');
    if (that.data.schedule) {
      let postData = {
        check_in_or_out: 1,
        duty_time: currentTime,
        duty_place: that.data.locate,
        shift_id: that.data.schedule.id,
        duty_type_id: '0',
        lat: that.data.latitude,
        lon: that.data.longitude,
      }
      http.postReq(app.globalData.url_online.url_9503 + 'manage/duty_record/add', postData, function(res) {
        console.log(res.data);
        if (res.message == 'success') {
          that.setData({
            ifflag: false
          })
          wx.showToast({
            title: '签退成功',
            icon: 'none'
          })
        } else {
          wx.showToast({
            title: '签退失败',
            icon: 'none'
          })
        }
      });
    } else {
      wx.showToast({
        title: '当前没有班次信息',
        icon: 'none'
      })
    }
  },

  /* 
    ** 二维码签到
   */
  // 签到按钮
  sign_in_2d() {
    let currentTime = that.get_time();
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log(res);
        if(res.errMsg == 'scanCode:ok'){
          let code_2d = res.result
          if (that.data.schedule) {
            let postData = {
              "check_in_or_out": 0,
              "duty_time": currentTime,
              "duty_place": that.data.locate,
              "shift_id": that.data.schedule.id,
              "duty_type_id": '0',
              "code_2d": code_2d,
              "lat": that.data.latitude,
              "lon": that.data.longitude,
            }
            http.postReq(app.globalData.url_online.url_9503 + 'manage/duty_record/add_from_2d', postData, function (res) {
              // console.log(res.data);
              if (res.message == 'success') {
                that.setData({
                  ifflag: false
                })
                wx.showToast({
                  title: '签到成功',
                  icon: 'none'
                })
              } else {
                wx.showToast({
                  title: '签到失败',
                  icon: 'none'
                })
              }

            });
          } else {
            wx.showToast({
              title: '当前没有班次信息',
              icon: 'none'
            })
          }
        }else{

        }
        
      }
    })
    
  },
  /* 
    ** 二维码签退
   */
  sign_out_2d() {
    let currentTime = that.get_time();
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log(res);
        if (res.errMsg == 'scanCode:ok') {
          let code_2d = res.result
          if (that.data.schedule) {
            let postData = {
              "check_in_or_out": 1,
              "duty_time": currentTime,
              "duty_place": that.data.locate,
              "shift_id": that.data.schedule.id,
              "duty_type_id": '0',
              "code_2d": code_2d,
              "lat": that.data.latitude,
              "lon": that.data.longitude,
            }
            http.postReq(app.globalData.url_online.url_9503 + 'manage/duty_record/add_from_2d', postData, function (res) {
              console.log(res.data);
              if (res.message == 'success') {
                that.setData({
                  ifflag: false
                })
                wx.showToast({
                  title: '签退成功',
                  icon: 'none'
                })
              } else {
                wx.showToast({
                  title: '签退失败',
                  icon: 'none'
                })
              }
            });
          } else {
            wx.showToast({
              title: '当前没有班次信息',
              icon: 'none'
            })
          }
        } else {

        }

      }
    })

  },
  // 用户选择位置功能
  locate: function() {
    var that = this;
    wx.showLoading({
      title: '',
    })
    // ------------ 腾讯LBS地图  --------------------
    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        //获取用户的初始位置
        wx.setStorageSync('start_long', res.longitude);
        wx.setStorageSync('start_lati', res.latitude);
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });
        var locationString = res.latitude + "," + res.longitude;
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/',
          data: {
            "key": "JMOBZ-5TKAV-AXHPC-UCDS4-T3Y5O-Y6BQV",
            "location": locationString
          },
          method: 'GET',
          success: function(r) {
            //输出一下位置信息 
            // console.log('用户位置信息', r.data.result);
            //r.data.result.address获得的就是用户的位置信息，将它保存到一个全局变量上 

            that.setData({
              locate: r.data.result.address
            })
            wx.hideLoading();
          },
          fail: function(r) {
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: '请确保您手机设置中-定位服务已打开'
            })
          }
        });
      }
    })
  },
  // 选择位置
  chooselocate: function(e) {
    var that = this;
    let index = e.currentTarget.dataset.index;
    wx.showLoading({
      title: '',
    })
    wx.getLocation({
      type: "gcj02",
      success: (res) => {
        //获取用户的初始位置
        wx.setStorageSync('start_long', res.longitude);
        wx.setStorageSync('start_lati', res.latitude);
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });
        var locationString = res.latitude + "," + res.longitude;
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/',
          data: {
            "key": "JMOBZ-5TKAV-AXHPC-UCDS4-T3Y5O-Y6BQV",
            "location": locationString
          },
          method: 'GET',
          success: function(r) {
            //输出一下位置信息 
            //r.data.result.address获得的就是用户的位置信息，将它保存到一个全局变量上 
            that.setData({
              locate: r.data.result.address
            });
            wx.hideLoading();
          },
          fail: function(res) {
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: '请确保您手机设置中-定位服务已打开'
            })

          }
        });
      },
      fail: function() {
        wx.getSetting({
          success: (res) => {
            // console.log(res.authSetting['scope.userLocation']);
            if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) { //非初始化进入该页面,且未授权
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                success: function(res) {
                  if (res.cancel) {
                    console.info("1授权失败返回数据");
                  } else if (res.confirm) {
                    console.log("confirm");
                    wx.openSetting({
                      success: function(data) {
                        // console.log(data);
                        if (data.authSetting["scope.userLocation"] == true) {
                          wx.showToast({
                            title: '授权成功',
                            icon: 'none',
                            duration: 2000
                          })
                          //再次授权，调用getLocationt的API
                          that.locate();
                        } else {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'none',
                            duration: 2000
                          })
                        }
                      }
                    })
                  }
                }
              })
            } else if (res.authSetting['scope.userLocation'] == undefined) { //初始化进入
              that.locate();
            }

          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  get_time() {
    var date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.date = date.getDate();
    this.day = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")[date.getDay()];
    this.hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    this.minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    this.second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    var currentTime = this.year + "-" + this.month + "-" + this.date + " " + this.hour + ":" + this.minute + ":" + this.second;
    return currentTime;
  },
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
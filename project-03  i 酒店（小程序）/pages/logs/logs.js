//logs.js
var app = getApp();
var hexMD5 = require('../../utils/MD5.js')
var that = undefined;
const http = require('../../utils/http.js');
const utils = require('../../utils/util.js');
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
    console.log(options.q);
    if (options.q) {
      //获取二维码的携带的链接信息
      let qrUrl = decodeURIComponent(options.q)
      console.log(qrUrl);
      this.setData({
        //获取链接中的参数信息
        authorization: utils.getQueryString(qrUrl, 'authorization')
      })
    } else{
      wx.reLaunch({
        url: '/pages/logins/logins',
      })
    }

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

  getUserInfo: function (e) {
    wx.login({
      success: function (res) {
        var code = res.code; //登录凭证
        console.log("登录凭证" + code);
        if (code) {
          that.setData({
            code: code
          })
          wx.request({
            url: app.globalData.url_online.url_9103 + 'system/wechat/update_user_weixin_info/',
            header: {
              'content-type': 'application/json',
              'authorization': that.data.authorization
            },
            data: {
              "code": code
            },
            method: 'post',
            success: function (res) {
              console.log('update_user_weixin_info', res.data);
              wx.reLaunch({
                url: '/pages/logins/logins',
              })
            },
            fail: function () {

            }
          })
          //授权
          wx.getSetting({
            success(res1) {
              // console.log(res1.authSetting);
              if (res1.authSetting['scope.userInfo']) {
                // 用户已经同意小程序获得用户信息，后续调用 wx.getUserInfo 接口不会弹窗询问
                //2、调用获取用户信息接口
                // var that = this;
                wx.getUserInfo({
                  success: function (res) {
                    console.log({
                      encryptedData: res.encryptedData,
                      iv: res.iv,
                      code: code
                    });
                    //3.请求自己的服务器，解密用户信息 获取unionId等加密信息

                  },
                  fail: function () {
                    console.log('获取用户信息失败');
                  }
                })
              }
            }
          })

        } else {
          console.log('获取用户登录态失败！' + r.errMsg)
        }
      },
      fail: function () {
        console.log('登陆失败')
      }
    });

  },

  /* formId: 拼接传给后台 */
  sendmes(e) {
    var that = this,
      formId = e.detail.formId;
    if (formId != 'the formId is a mock one' && formId) {
      that.data.formIdArray.push(formId);
      that.setData({
        formIdArray: that.data.formIdArray
      })
    }
    console.log(that.data.formIdArray);

  }
})

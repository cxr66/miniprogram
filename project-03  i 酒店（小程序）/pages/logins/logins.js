// pages/logins/logins.js
var app = getApp();
const hexMD5 = require('../../utils/MD5.js')
var that = undefined;
const http = require('../../utils/http.js');
const AudioContext = require('../../utils/AudioContext.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    /* 
      * 0: 用户名密码登录 
      * 1: 手机验证码登录
      * 2: 微信授权登录
      * 3: 多酒店登录
    */

    visiable: "0",

    /* 用户名密码登录 */
    form: {
      hotel_code: 'SHJKJD',
      user_name: '',
      password: '',
      isChecked: false
    },
    /* 手机验证码登录 */
    form_phone: {
      hotel_code: 'SHJKJD',
      phonenum: '',
      code: ''
    },

    /* 多酒店登录 */
    form_more: {
      name: '',
      psd: '',
    },
    // 倒计时
    intervalTime: 60,
    showInterval: true, //显示倒计时
    selectShow: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['皇冠晶品酒店松江店', '皇冠晶品酒店浦东店', '皇冠晶品酒店合肥店'], //下拉列表的数据
    hotel_index: 0, //选择的下拉列表下标
    ban_show: false,
    banData: [{
      id: null
    }], //下拉列表的数据
    ban_index: 0, //选择的下拉列表下标

    formIdArray: [] //formId
  },
  /* 切换手机号码登录 */
  bind_check(e) {
    let visiable = e.currentTarget.dataset.visiable;
    that.setData({
      visiable: visiable
    })
  },


   /* 点击下拉显示框 */
  selectTap(e) {
    if (e.currentTarget.dataset.flag === '0') {
      this.setData({
        selectShow: !this.data.selectShow
      });
    } else if (e.currentTarget.dataset.flag === '1') {
      this.setData({
        ban_show: !this.data.ban_show
      });

      if (that.data.form.hotel_code.length) {
        if (that.data.form.user_name.length) {
          if (that.data.form.password.length) {

            wx.request({
              url: app.globalData.url_online.url_9503 + "manage/duty_shift/hotel_shifts_at_login",
              data: {
                hotel_group_code: that.data.form.hotel_code,
                user_name: that.data.form.user_name,
                page_size: 999,
              },
              method: 'POST',
              success: function (res) {
                // console.log(res.data.data);
                if (res.data.message == 'success') {
                  if (res.data.data.length) {
                    that.setData({
                      banData: res.data.data
                    })
                  } else {
                    that.setData({
                      banData: [{
                        id: null
                      }],
                      ban_index: 0,
                    })
                    wx.showToast({
                      title: '当前用户没有班次信息',
                      icon: 'none'
                    })
                  }
                } else {
                  wx.showToast({
                    title: '获取班次失败：' + res.data.message,
                    icon: 'none'
                  })
                }

              },
              fail: function (err) {
                console.log(err, "push err");
              }
            })
          } else {
            wx.showToast({
              title: '请输入密码',
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: '请输入用户名',
            icon: 'none'
          })
        }

      } else {
        wx.showToast({
          title: '请输入集团码',
          icon: 'none'
        })
      }
    } else {
      this.setData({
        ban_show: !this.data.ban_show
      });
      if (that.data.form_phone.hotel_code.length) {
        if (that.checkPhone(that.data.form_phone.phonenum)) {

          wx.request({
            url: app.globalData.url_online.url_9503 + "manage/duty_shift/hotel_shifts_at_login",
            data: {
              "hotel_group_code": that.data.form.hotel_code,
              "phone": that.data.form_phone.phonenum,
            },
            method: 'POST',
            success: function (res) {
              if (res.data.message == 'success') {
                if (res.data.data.length) {
                  that.setData({
                    banData: res.data.data
                  })
                } else {
                  wx.showToast({
                    title: '当前用户没有班次信息',
                    icon: 'none'
                  })
                }
              } else {
                wx.showToast({
                  title: '获取班次失败：' + res.data.message,
                  icon: 'none'
                })
              }

            },
            fail: function (err) {
              console.log(err, "push err");
            }
          })

        } else {
          wx.showToast({
            title: '请输入手机号',
            icon: 'none'
          })
        }

      } else {
        wx.showToast({
          title: '请输入集团码',
          icon: 'none'
        })
      }
    }
  },
   /* 点击下拉列表 */
  optionTap(e) {
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    if (e.currentTarget.dataset.flag === '0') {
      this.setData({
        hotel_index: Index,
        selectShow: !this.data.selectShow
      });
    } else {
      this.setData({
        ban_index: Index,
        ban_show: !this.data.ban_show
      });
    }

  },
   /* 输入 */
  blur_set(e) {
    if (e.currentTarget.dataset.blur === '0') {
      that.setData({
        ['form.user_name']: e.detail.value
      })
    } else if (e.currentTarget.dataset.blur === '1') {
      that.setData({
        ['form.password']: e.detail.value
      })
    } else if (e.currentTarget.dataset.blur === '2') {
      that.setData({
        ['form_phone.phonenum']: e.detail.value
      })
    } else if (e.currentTarget.dataset.blur === '3') {
      that.setData({
        ['form_phone.code']: e.detail.value
      })
    } else if (e.currentTarget.dataset.blur === '5') {
      that.setData({
        ['form.hotel_code']: e.detail.value
      })
    }

  },
   /* 是否记住账号密码 */

  switchChange: function (e) {
    that.setData({
      ['form.isChecked']: e.detail.value
    })
  },
   /* 登录函数 */
  login(e) {
    console.log('login function');
    if (that.data.form.hotel_code.length) {
      if (that.data.form.user_name.length) {
        if (that.data.form.password.length) {
          
          /* 记住密码 */
          if (that.data.form.isChecked) {
            wx.setStorageSync('form', that.data.form);
          } else {
            wx.removeStorage({
              key: 'form',
              success: function (res) {

              }
            })
          }

          wx.showLoading({
            title: '',
            mask: true
          }) 
          console.log(that.data.banData[that.data.ban_index].id);
          /* 发送请求 */
          wx.request({
            url: app.globalData.url_online.url_login + 'common/employee/login', //服务接口地址
            method: 'post',
            data: {
              'code': that.data.form.hotel_code,
              'user_name': that.data.form.user_name,
              'password': hexMD5.hexMD5(that.data.form.password),
              'shift_id': that.data.banData[that.data.ban_index].id
            },
            success: function (res) {
              // console.log(res.data);
              
              if (res.data.message === 'success') {

                AudioContext.AudioContext('登录成功');
                wx.setStorageSync('codeInfo', res.data);
                app.globalData.codeInfo = res.data;
                res.data.user_info.shift_id = that.data.banData[that.data.ban_index].id;
                wx.setStorageSync('userInfo', res.data.user_info);
                app.globalData.userInfo = res.data.user_info;

                if (that.data.formIdArray.length) {
                  /* 传送formId */
                  wx.request({
                    url: app.globalData.url_online.url_9103 + 'system/wechat/cache_open_id_form_id/',
                    data: {
                      "form_id_list": JSON.stringify(that.data.formIdArray)
                    },
                    method: 'POST',
                    header: {
                      'content-type': 'application/json',
                      'authorization': app.globalData.codeInfo.new_authorization
                    },
                    success: function (res) {
                      console.log(res.data, "push msg");
                    },
                    fail: function (err) {
                      console.log(err, "push err");
                    }
                  })
                }
                wx.navigateTo({
                  url: '/pages/appindex/appindex',
                  success:function(){
                    wx.hideLoading();
                  }
                })

              } else {
                AudioContext.AudioContext('登录失败：' + res.data.message);
                wx.showToast({
                  title: '登录失败：' + res.data.message,
                  icon: "none"
                })
                wx.hideLoading();
              }

              
            },
            fail: function (res) {
              wx.showToast({
                title: '系统错误,登录失败',
                icon: "none"
              })
            }
          })
        } else {
          AudioContext.AudioContext('请输入密码');
          wx.showToast({
            title: '密码错误是不能进入我们掌屋的',
            icon: 'none'
          })
        }
      } else {
        AudioContext.AudioContext('请输入用户名');
        wx.showToast({
          title: '名字好像输错了哦~~',
          icon: 'none'
        })
      }
    } else {
      AudioContext.AudioContext('请输入集团代码');
      wx.showToast({
        title: '请输入集团代码',
        icon: 'none'
      })
    }
  },

   /* 用户手机号码验证登录 */
  check_phone(e) {
    if (that.checkPhone(that.data.form_phone.phonenum)) { 
      wx.request({
        url: app.globalData.url_online.url_login + 'common/sms/employee/login', //服务接口地址
        method: 'post',
        data: {
          'phone': that.data.form_phone.phonenum
        },
        success: function (res) {
          if (res.data.message === 'success') {
            AudioContext.AudioContext('发送成功');
            wx.showToast({
              title: '验证信息发送成功',
              icon: "none"
            })
            that.setData({
              showInterval: false
            })
            var phone_code_interval = setInterval(function () {
              that.data.intervalTime--;
              that.setData({
                intervalTime: that.data.intervalTime
              })
              if (that.data.intervalTime == 0) {
                that.setData({
                  intervalTime: 60,
                  showInterval: true
                })
                clearInterval(phone_code_interval);
              }
            }, 1000)
          } else {
            AudioContext.AudioContext('验证码发送失败');
            wx.showToast({
              title: '验证信息发送失败',
              icon: "none"
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: '验证信息发送失败',
            icon: "none"
          })
        }
      })
    } else {
      AudioContext.AudioContext('请输入手机号码');
      wx.showToast({
        title: '请输入手机号码',
        icon: "none"
      })
    }
  },
   /* 用户手机号码验证登录 */
  check_phone_login(e) {
    if (that.data.form_phone.phonenum && that.data.form_phone.code) {

      wx.request({
        url: app.globalData.url_online.url_login + 'common/sms/employee/check_login', //服务接口地址
        method: 'post',
        data: {
          'code': that.data.form.hotel_code,
          'phone': that.data.form_phone.phonenum,
          'sms': that.data.form_phone.code,
          'shift_id': that.data.banData[that.data.ban_index].id
        },
        success: function (res) {
          // console.log(res.data);
          if (res.data.message === 'success') {
            AudioContext.AudioContext('登录成功');
            wx.setStorageSync('codeInfo', res.data);
            app.globalData.codeInfo = res.data;

            res.data.user_info.shift_id = that.data.banData[that.data.ban_index].id;
            wx.setStorageSync('userInfo', res.data.user_info);
            app.globalData.userInfo = res.data.user_info;

            /* 传送formId */
            if (that.data.formIdArray.length) {
              wx.request({
                url: app.globalData.url_online.url_9103 + 'system/wechat/cache_open_id_form_id/',
                data: {
                  "form_id_list": JSON.stringify(that.data.formIdArray)
                },
                method: 'POST',
                header: {
                  'content-type': 'application/json',
                  'authorization': app.globalData.codeInfo.new_authorization
                }, //请求头,也可以没有
                success: function (res) {
                  console.log(res.data, "push msg");
                },
                fail: function (err) {
                  console.log(err, "push err");
                }
              })
            }
            wx.navigateTo({
              url: '/pages/appindex/appindex',
            })
          } else {
            AudioContext.AudioContext('登录失败：' + res.data.message);
            wx.showToast({
              title: '登录失败：' + res.data.message,
              icon: "none",
              duration: 4000
            })
          }
        },
        fail: function () {
          console.log('系统错误');
          wx.showToast({
            title: '系统错误,登录失败',
            icon: "none",
            duration: 4000
          })
        }
      })


    } else {
      AudioContext.AudioContext('手机号码和验证码为必填项');
      wx.showToast({
        title: '手机号码和验证码为必填项',
        icon: "none"
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    if (wx.getStorageSync('form')) {
      that.setData({
        form: wx.getStorageSync('form')
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

  // 验证手机号码
  checkPhone(phone) {
    if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {

      return false;
    } else {
      return true;
    }
  },

  getUserInfo: function (e) {
    wx.login({
      success: function (res) {
        var code = res.code; //登录凭证
        // console.log("登录凭证" + code);
        /* 
          * 0: 用户名密码登录 
          * 1: 手机验证码登录
          * 2: 微信授权登录
          * 3: 多酒店登录
        */
        if (that.data.visiable == '1') {
          that.check_phone_login();
        } else if (that.data.visiable == '0'){
          that.login();
        } else if (that.data.visiable == '2') {
          that.login();
        } else if (that.data.visiable == '3') {
          that.login();
        }

        if (code) {
          that.setData({
            code: code
          })
          
          /* wx.request({
            url: app.globalData.url_online.url_9103 + 'system/wechat/update_user_weixin_info/',
            header: {
              'content-type': 'application/json',
              'authorization': app.globalData.codeInfo.new_authorization
            },
            data: {
              "code": code
            },
            method: 'post',
            success: function (res) {
              console.log('update_user_weixin_info', res.data);
            },
            fail: function () {

            }
          }) */
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
                    // console.log(res);
                    wx.setStorage({
                      key: 'wx_userInfo',
                      data: res.userInfo,
                    })
                    /* console.log({
                      encryptedData: res.encryptedData,
                      iv: res.iv,
                      code: code
                    }); */
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

  }
})
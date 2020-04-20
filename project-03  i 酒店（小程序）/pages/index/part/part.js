// pages/index/part/part.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 详细订单
    partList: [],

    // 固定定位按钮
    btn_group: [
      /* {
        desc: '入消费',
        bind: 'add_btn_charge'
      },
      {
        desc: '续住',
        bind: 'showtoast'
      },
      {
        desc: '挂账',
        bind: 'add_ar'
      }, */
      {
        desc: '退房',
        bind: 'check_out'
      }
    ],

    /* 加收房费弹窗 */
    modal_add_fee: true,
    reason_begin_date: '',
    form: {
      money: 0,
      remark: ''
    },
    accountCodeIndex: 0,
    payModeIndex: 0,
    reasonIndex: 0,
    /* 挂AR账户 */
    ar_modal_add_fee: true,
    arIndex: 0
  },
  // 跳转
  navigate(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.link,
    })
  },
  link_room_func(e) {
    wx.redirectTo({
      url: '/pages/index/part/part?room_no=' + e.currentTarget.dataset.roomno,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    that.setData({
      room_no: options.room_no
    })
    // console.log(options.id);
    /* 发送请求 */
    wx.showLoading({
      title: '',
      mask: true
    })

    
    // state:0:预订房；1：入住房
 
     http.getReq(app.globalData.url_online.url_9102+'ordering/master_base_list/?room_number='+that.data.room_no
    , function(res) {
      console.log('任京获取是否有入住', res.data);
      if (res.data.count) {
        that.setData({
          partList: res.data.results,
          account_id: res.data.results[0].account_id,
          order_no: res.data.results[0].order_no
        })
        // that.get_info_by_account_id(res.data.results[0].account_id);

        // 查询消费
        let params = {
          account_id: that.data.account_id,
          page_num: 1,
          page_size: 9999
        };
        // that.get_consume_by_roomnum(params);
      } else {
        wx.showToast({
          title: '未查询到入住信息',
          icon: 'none'
        })
      } 
      wx.hideLoading();
    }); 

    
    // 付款原因
    // that.get_pay_reason();
    // 付款方式
    // that.get_pay_mode_reason();
    // AR账户
    // that.get_ar_account({});
  },
  /* 查房 */
  checkDetail(e) {
    let url = app.globalData.url_online.url_9104 + 'room_service/validate_room_check/',
      params = {
        "room_no": that.data.room_no,
        "master_id": that.data.master_id,
        "account_id": that.data.account_id,
      };
    http.postReq(url, params, function(res) {
      console.log('是否有查房任务', res.data);
      if (res.data.success === true) {
        wx.showToast({
          title: '该房间暂时没有查房任务',
          icon: 'none'
        })
      } else {
        wx.navigateTo({
          url: e.currentTarget.dataset.link,
        })

      }

    });

  },
  /* 根据 account_id 单个房间查消费 */
  /* get_consume_by_roomnum(params) {
    let url = app.globalData.url_online.url_login + 'finance/account/get_by_room_numbers';
    http.postReq(url, params, function(res) {
      console.log('消费', res.data);
      that.setData({
        custom_list: res.data,
      })
    });
  }, */
  get_consume_by_roomnum(params) {
    let url = app.globalData.url_online.url_login + 'finance/charge_detail/info_list';
    console.log(params);
    http.postReq(url, params, function(res) {
      console.log('消费', res.data);
      for (let i in res.data.list) {
        res.data.list[i].charge_amount = res.data.list[i].charge_amount * -1
      }
      that.setData({
        custom_list: res.data.list
      })
    });
  },
  /* 按照account_id查询单个房间的账务信息 */
  get_info_by_account_id(account_id) {
    let url = app.globalData.url_online.url_9102 + 'accounts/get_account_base_info/' + account_id;
   /*  http.getReq(url, function(res) {
      console.log('按照account_id查询单个房间的账务信息', res.data);
      if (res.data) {
        res.data.balance = res.data.balance * -1
        that.setData({
          account: res.data
        })
      } else {
        wx.showToast({
          title: '查询单个房间的账务信息失败',
          icon: 'none'
        })
      }
    }); */

    wx.request({
      url: url,
      method: 'GET',
      header: {
        'authorization': app.globalData.codeInfo.new_authorization,  
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.new_authorization) {
          app.globalData.codeInfo.new_authorization = res.data.new_authorization;
          wx.setStorageSync('codeInfo', app.globalData.codeInfo);
        }
        
        switch (res.data.message) {
          case 'success':
            console.log('按照account_id查询单个房间的账务信息', res.data.data);
            if (res.data.data) {
              res.data.data.balance = res.data.data.balance * -1
              that.setData({
                account: res.data.data
              })
            } else {
              wx.showToast({
                title: '查询单个房间的账务信息失败',
                icon: 'none'
              })
            }
            break;
  
          case 'authorization invalid':
            app.globalData.userInfo = {};
            app.globalData.codeInfo = {};
            wx.reLaunch({
              url: '/pages/logins/logins',
            })
            break;
  
          case 'access refused 6':
            wx.showToast({
              title: '权限不足,部分展示且不可操作',
              icon: 'none'
            })
            break;
  
          default:
            wx.showToast({
              title: '服务出错,错误原因：' + res.data.message,
              icon: "none"
            })
        } 
      },
      fail: function() {
        wx.reLaunch({
          url: '/pages/logins/logins',
        }) 
      }
    })
  },
  /* ************************************入消费弹窗*************************************************** */
  /* 
  finance/code_pay_for/info_list  
  付款原因接口 */
  get_pay_reason() {
    let url = app.globalData.url_online.url_login + 'finance/code_pay_for/info_list';
    http.postReq(url, {}, function(res) {
      console.log('付款原因接口', res.data);
      that.setData({
        payReasonList: res.data.list
      })
      // 入账代码
      that.get_account_code({
        'code_pay_for': that.data.payReasonList[that.data.reasonIndex].id
      });
    });
  },
  /* 
  finance/pay_mode/info_list  
  付款方式接口 */
  get_pay_mode_reason() {
    let url = app.globalData.url_online.url_login + 'finance/pay_mode/info_list';
    http.postReq(url, {}, function(res) {
      console.log('付款方式接口', res.data);
      that.setData({
        payModeList: res.data.list
      })
      console.log(that.data.payModeList);
    });
  },
  /* 
    finance/incoming_account_code/info_list  
  入账代码接口 */
  get_account_code(params) {
    let url = app.globalData.url_online.url_login + 'finance/incoming_account_code/info_list';
    http.postReq(url, params, function(res) {
      console.log('入账代码接口', res.data);
      that.setData({
        accountCodeList: res.data.list
      })

    });
  },
  /* 加收房费 */
  add_btn_charge(e) {
    that.setData({
      modal_add_fee: !that.data.modal_add_fee
    })
  },
  /* 加收房费 */
  add_charge() {
    let url = app.globalData.url_online.url_login + 'finance/charge_detail/add_charges',
      params = {
        account_id: that.data.account_id, //主账户id
        charges: [{
          code_income_type_id: that.data.accountCodeList[that.data.accountCodeIndex].id, //入账类型代码id
          reference_id: that.data.partList[0].id, // 入住单id
          gen_time: app.getNowFormatDate(), // 业务发生的实际时间
          pay_status: 0, // 支付状态 0：未付，1：结清，2：挂账/AR支付，3：部分支付 4: 异常
          charge_amount: that.data.form.money, // 消费金额
          desc: that.data.form.remark, // 说明===>此时为摘要
        }],
      };
    if (parseInt(that.data.form.money)) {
      http.postReq(url, params, function(res) {
        console.log('增加消费', res);
        if (res.message === 'success') {
          wx.showToast({
            title: '入消费成功',
            icon: 'none'
          })
          that.add_btn_charge();
          // 查询消费
          let params = {
            account_id: that.data.account_id,
            page_num: 1,
            page_size: 9999
          };
          that.get_consume_by_roomnum(params);

          that.get_info_by_account_id(that.data.account_id);
        } else {
          wx.showToast({
            title: '入消费失败',
            icon: 'none'
          })
        }
      });
    } else {
      wx.showToast({
        title: '金额不能为0',
        icon: 'none'
      })
    }
  },

  bindPickerChange(e) {
    if (e.currentTarget.dataset.flag == '0') {
      this.setData({
        accountCodeIndex: e.detail.value
      })
    } else if (e.currentTarget.dataset.flag == '1') {
      this.setData({
        reasonIndex: e.detail.value
      })
      /* 
        根据付款原因查询入账代码
       */
      that.get_account_code({
        'code_pay_for': that.data.payReasonList[that.data.reasonIndex].id
      });
    } else if (e.currentTarget.dataset.flag == '2') {
      this.setData({
        payModeIndex: e.detail.value
      })
    } else if (e.currentTarget.dataset.flag == 'ar') {
      this.setData({
        arIndex: e.detail.value
      })
    }
    
  },

  /* *********************************************** 挂AR账户 *********************************************  */
  /* 
    AR账户代码接口
  */
  get_ar_account(params) {
    let url = app.globalData.url_online.url_login + 'finance/ar_account/info_list?page_size=9999';
    http.postReq(url, params, function (res) {
      console.log('AR账户代码', res.data);
      that.setData({
        arList: res.data.list
      })
    });
  },
  /* AR账户 */
  add_ar(e) {
    that.setData({
      ar_modal_add_fee: !that.data.ar_modal_add_fee
    })
  }, 
  confirm_ar() {
    let url = app.globalData.url_online.url_login + 'finance/ar_account/batch_transfer',
      params = {
        ar_id: that.data.arList[that.data.arIndex].id,
        from_id:that.data.account_id, 
      };
      http.postReq(url, params, function (res) {
        console.log('挂AR账户', res);
        if (res.message === 'success') {
          wx.showToast({
            title: '挂AR账成功',
            icon: 'none'
          })
          that.add_ar();

        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      });

  },
  /* 退房 */
  check_out() {
    let url = app.globalData.url_online.url_9202_v2 + 'checkin/middle_check_out/',
      params = {
        "order_no": that.data.order_no
      };
    http.postReq(url, params, function(res) {
      console.log('退房', res);
      if (res.message === 'success') {
        wx.showToast({
          title: '退房成功',
          icon: 'none'
        })

        wx.redirectTo({
          url: '/pages/index/index',
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
    wx.showLoading({
      title: '',
    }) 
    http.getReq(app.globalData.url_online.url_9102+'ordering/master_base_list/?room_number='+that.data.room_no
    , function(res) {
      console.log('任京获取是否有入住', res.data);
      if (res.data.count) {
        that.setData({
          partList: res.data.results,
          account_id: res.data.results[0].account_id,
          order_no: res.data.results[0].order_no
        })
        // that.get_info_by_account_id(res.data.results[0].account_id);

        // 查询消费
        let params = {
          account_id: that.data.account_id,
          page_num: 1,
          page_size: 9999
        };
        // that.get_consume_by_roomnum(params);
      } else {
        wx.showToast({
          title: '未查询到入住信息',
          icon: 'none'
        })
      } 
      wx.hideLoading();
    });

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

  },
  /* 
   * 禁止触摸滑动 
   */
  preventTouchMove: function() {

  },
  /* 时间 */
  bindDateChange(e) {
    this.setData({
      reason_begin_date: e.detail.value
    })
  },

  // textarea失去焦点
  bindTextAreaBlur(e) {
    console.log(e.detail.value);
    if (e.currentTarget.dataset.flag == '0') {
      that.setData({
        ['form.money']: e.detail.value
      })
    } else {
      that.setData({
        ['form.remark']: e.detail.value
      })
    }
  },

  showtoast() {
    wx.showToast({
      title: '努力开发优化中...',
      icon: 'none'
    })
  }
})
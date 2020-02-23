// pages/index/order/order.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    on_date: '2019-03-15', //flag = '0'
    off_date: '2019-03-15', //flag = '1'
    // 详细订单
    orderJson: {
      name: '', //input_flag = '0'
      phone: '', //input_flag = '1'
      room_num: '',
      room_type: '',
      remark: ' ', //input_flag = '2'
    },
    // 固定定位按钮
    btn_group: [{
      desc: '预订',
      bind: 'order'
    }]
  },
  // input输入值
  bindinput(e) {
    if (e.currentTarget.dataset.input_flag === '0') {
      this.setData({
        ['orderJson.name']: e.detail.value
      })
    } else if (e.currentTarget.dataset.input_flag === '1') {
      this.setData({
        ['orderJson.phone']: e.detail.value
      })
    } else {
      this.setData({
        ['orderJson.remark']: e.detail.value
      })
    }
  },
  // 时间选择器
  bindDateChange(e) {
    if (e.currentTarget.dataset.flag === '0') {
      this.setData({
        on_date: e.detail.value
      })
    } else {
      this.setData({
        off_date: e.detail.value
      })
    }
  },

  // 天数增加
  setDate(dayNum) {
    var date1 = new Date(),
      time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate(); //time1表示当前时间
    var date2 = new Date(date1);
    date2.setDate(date1.getDate() + dayNum);
    var time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
    return time2;
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
    that.setData({
      room_number: options.room_no,
      ['orderJson.room_num']: options.room_no,
      room_type: options.room_type,
      room_type_code: options.room_type_code,
      on_date: Y + '-' + M + '-' + D,
      off_date: that.setDate(1),
    })


    // 获取的预订单
    let params = {
      room_number: options.room_no,
      search_type: '1'
    }
    http.postReq(app.globalData.url_online.url_9202 + 'booking/get_all_reserve_info/', params, function(res) {
      console.log('获取是否有预订单', res.data);
      if (res.message == 'success') {

        if (res.data.results.length) {
          wx.showToast({
            title: '已有预定',
            icon: 'none'
          })
          that.setData({
            orderJson: {

              name: res.data.results[0].name, //input_flag = '0'
              phone: res.data.results[0].telephone_master, //input_flag = '1'

              remark: res.data.results[0].rt_rate[0].remark, //input_flag = '2'
            },
            on_date: res.data.results[0].arr_time,
            off_date: res.data.results[0].leave_time,
            btn_group: [{
                desc: '已有预订',
                bind: ''
              },
              {
                desc: '入住',
                bind: 'checkin'
              }
            ]
          })
          console.log(that.data.orderJson);
        } else {
          wx.showToast({
            title: '暂无预定',
            icon: 'none'
          })
        }
      }
    });
  },

  /**
   * @send_msg 发送短信
   */
  send_msg(params) {
    http.postReq('https://sms.eloadspider.com/v1/authentication/ht/sms/send_message/', params, function(res) {
      console.log(res);

    });
  },
  /* 预定 */
  order(e) {
    let url = app.globalData.url_online.url_9202 + 'booking/add_reserve/',
      params = {
        "rt_rate": [{
          "code_name": that.data.room_type_code, //
          "room_type": that.data.room_type, //
          "room_class": "1",
          "room_number": "",
          "ratecode_id": null,
          "fix_rate": 368,
          "room_count": 1,
          "remark": "",
          "reserve_base_id": "",
          "checkin_date": that.data.on_date + ' 12:00:00',
          "checkin_time": that.data.on_date + ' 12:00:00',
          "code_room_special_ids": "1",
          "code_room_facilities_ids": "1",
          "is_arranged": true,
          "rmocc_ids": "",
          "add_person_num": 1,
          "add_person_price": 1,
          "add_bed_num": 1,
          "add_bed_price": 1,
          "code_pkg_id": 1,
          "add_pkg_num": 1,
          "add_pkg_price": 1,
          "rate_service_fee": 1,
          "rate_tax": 1,
          "lower_price_id": 1,
          "lower_price_reason": "1",
          "lower_price_amount": 1,
          "real_rate": 1
        }],
        "reserve_base": {
          "rsv_type": 1,
          "rsv_lable": 0,
          "rsv_person_name": that.data.orderJson.name,
          "telephone_master": that.data.orderJson.phone,
          "arr_time": that.data.on_date + ' 12:00:00',
          "leave_time": that.data.off_date + ' 12:00:00',
          "is_fix_rate": 1,
          "is_secrete": 1,
          "is_secret_rate": 1,
          "allowed_ar": 1,
          "account_id": null,
          "biz_date": "2018-12-01 10:10:01",
          "team_id": 1,
          "rsv_from": 1,
          "order_no": "",
          "confirmed": false,
          "sales_person_id": 1,
          "code_occ_id": 1,
          "extra_flag": 1,
          "adult_num": 1,
          "children_num": 1,
          "purpose": "1",
          "name": that.data.orderJson.name,
          "email_master": "",
          "weixin_master": "1",
          "mobile_master": "1",
          "id_no": "1",
          "fix_rate": null,
          "ar_id": "1",
          "code_commision_id": "1",
          "code_market_id": "",
          "code_src_id": "WAK",
          "rsv_status_lable": 0,
          "total_chartge": 0,
          "total_pay": 0,
          "last_account_id": null,
          "last_pay_id": 1,
          "account_num": 1,
          "pay_num": 1
        },
        "reserve_guest": [{
          "room_number": that.data.room_number, //
          "id_code": "01",
          "id_no": "",
          "name": "",
          "sex": "0",
          "telephone": "",
          "street_add": "",
          "last_name": null,
          "first_name": null,
          "name2": null,
          "name_combi": null,
          "is_save": false,
          "language": "2",
          "title": null,
          "salutation": null,
          "race": null,
          "religion": null,
          "career": "122",
          "nation": null,
          "visa_no": null,
          "visa_grant": null,
          "enter_port": null,
          "where_from": null,
          "where_to": null,
          "salary": null,
          "education": null,
          "marital": null,
          "company_id": null,
          "company_na": "222",
          "pic_photo": null,
          "pic_sign": null,
          "remark": that.data.orderJson.remark,
          "is_anonymo": false,
          "weixin": "2",
          "mobile": that.data.orderJson.phone,
          "email": "",
          "country_id": null,
          "division_id": null,
          "state_id": null,
          "city_id": null,
          "zipcode": null, 
        }]
      };
    if (that.data.orderJson.name) {
      if (that.data.orderJson.phone.length == 11) {
        http.postReq(url, params, function(res) {
          console.log(res);
          if (res.message == 'success') {
            wx.showToast({
              title: '预定成功,订单号为' + res.data.order_no,
              icon: 'none'
            }) 
            var order_no = res.data.order_no;
            /* 请求房价 */
            let room_type = [];
            room_type.push(that.data.room_type_code);
            http.postReq(app.globalData.url_online.url_9101 + 'machine/get_room_type_price/', {
              "room_type": room_type,
              "begin_date": that.data.on_date,
              "end_date": that.data.off_date,
              "rate_code": "BAR"
            }, function (res) {
              console.log('请求房价', res.data.data);
              var room_price = 0, price_list = res.data.data[0].price_list, day = res.data.data[0].price_list.length;
              for (let i in price_list){
                room_price += parseFloat(price_list[i].day_price);
              }
              console.log(room_price)
              //发送消息
              that.send_msg({
                phone_number: that.data.orderJson.phone,
                sign_name: "皇冠晶品酒店服务中心",
                template_code: "SMS_173405844",
                template_param: {
                  status: "成功",
                  order: order_no.slice(0, 4) + '****' + order_no.slice(-5, -1),
                  name: that.data.orderJson.name,
                  date: that.data.on_date,
                  hotel: "科冠晶品酒店",
                  roomtype: that.data.room_type,
                  much: "1",
                  day: day,
                  money: room_price,
                  adress: "上海市浦东新区人民东路2635弄105号",
                  tel: '4001600703'
                }
              });

            });


            
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            }, 2000)

          } else {
            wx.showToast({
              title: '预定失败',
              icon: 'none'
            })
          }
        });
      } else {
        wx.showToast({
          title: '手机号码不能少于11位',
          icon: 'none'
        })
      }
    } else {
      wx.showToast({
        title: '上述除备注都是必填项',
        icon: 'none'
      })
    }

  },

  /* 入住 */
  checkin() {
    let url = app.globalData.url_online.url_9202 + 'checkin/batch_booking_check_in/',
      params = {
        "rt_rate": [{
          "id": 27,
          "code": null,
          "code_name": "FYDCF",
          "create_datetime": "2019-06-18T10:51:27",
          "create_user_id": 28,
          "descript": null,
          "descript_en": null,
          "hotel_group_id": 4,
          "hotel_id": 6,
          "is_halt": false,
          "list_order": null,
          "modify_date": "2019-06-18T10:51:27",
          "modify_user_id": 28,
          "reserve_base_id": "B15608262875681846",
          "checkin_date": "2018-12-01T10:10:01",
          "checkin_time": "2018-12-01T10:10:01",
          "room_class": "1",
          "room_type": "风雅大床房",
          "room_number": "737",
          "code_room_special_ids": "1",
          "code_room_facilities_ids": "1",
          "is_arranged": true,
          "rmocc_ids": "",
          "ratecode_id": null,
          "fix_rate": 368,
          "add_person_num": 1,
          "add_person_price": 1,
          "add_bed_num": 1,
          "add_bed_price": 1,
          "code_pkg_id": 1,
          "add_pkg_num": 1,
          "add_pkg_price": 1,
          "rate_service_fee": 1,
          "rate_tax": 1,
          "lower_price_id": 1,
          "lower_price_reason": "1",
          "lower_price_amount": 1,
          "real_rate": 1,
          "remark": "",
          "is_checkin": null,
          "room_count": "1"
        }],
        "reserve_guest": [{
          "create_datetime": "2019-06-18T10:51:27",
          "create_user_id": 28,
          "modify_date": "2019-06-18T10:51:27",
          "modify_user_id": 28,
          "room_number": "737",
          "name": "das",
          "telephone": "",
          "reserve_base_id": "B15608262875681846",
          "guest_id": 123456,
          "id_no": "411521199812205431",
          "sex": "0",
          "id_code": "01"
        }],
        "reserve_base": {
          "rsv_type": 1,
          "rsv_lable": 0,
          "rsv_person_name": "订单11",
          "telephone_master": "15026864009",
          "arr_time": "2019-06-18 10:49:16",
          "leave_time": "2019-06-19 14:00:00",
          "is_fix_rate": true,
          "is_secrete": true,
          "is_secret_rate": true,
          "descript": null,
          "descript_en": null,
          "account_id": null,
          "biz_date": "2018-12-01T10:10:01",
          "team_id": 1,
          "rsv_from": 1,
          "order_no": "B15608262875681846",
          "confirmed": false,
          "sales_person_id": 1,
          "code_occ_id": 1,
          "extra_flag": 1,
          "adult_num": 1,
          "children_num": 1,
          "purpose": "1",
          "name": "1111",
          "email_master": "101608@qq.com",
          "weixin_master": "1",
          "mobile_master": "1",
          "fix_rate": "",
          "code_commision_id": "1",
          "code_market_id": "",
          "code_src_id": "WAK",
          "rsv_status_lable": 0,
          "account_opened": 0,
          "total_chartge": "0.00",
          "total_pay": "0.00",
          "last_account_id": null,
          "last_pay_id": 1,
          "account_num": 1,
          "pay_num": 1
        }
      };


    http.postReq(url, params, function(res) {
      console.log(res);
      if (res.message == 'success') {
        wx.showToast({
          title: '入住成功',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '入住失败',
          icon: 'none'
        })
      }
    });
  },


  /* 无预订无法入住 */
  nocheckin(e) {
    wx.showToast({
      title: '无预定无法入住',
      icon: 'none'
    })
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
// pages/index/order/order.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
const hexMD5 = require('../../../utils/MD5.js');
import { base64src } from '../../../utils/base64.js';

var getDaysBetween = function (dateString1, dateString2) {
  var startDate = Date.parse(dateString1);
  var endDate = Date.parse(dateString2);
  var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
  // alert(days);
  return days;
}

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
      phone: '', //input_flag = '1'  17679329004
      room_num: '',
      room_type: '',
      id_no: '',// 500235199302104113
      remark: '', //input_flag = '2'
    },
    // 固定定位按钮
    btn_group: [
      {
        desc: '查看已预订',
        bind: 'navigate',
      }, {
        desc: '预订',
        bind: 'order'
      }],
    guestHide: true,
    guestList: []
  },
  navigate(e) {
    let link = '/pages/index/orderrecord/orderrecord?room_number=' + that.data.room_number;
    wx.navigateTo({
      url: link,
    })
  },
  /** *
   * @add_guest 增加同住人 */
  add_guest() {
    if (that.data.guestList.length < (parseInt(that.data.max_can_live_num) - 1)) {
      that.data.guestList.push({
        name: '',
        id_no: ''
      })
      that.setData({
        guestList: that.data.guestList,
        guestHide: false
      })
    } else {
      wx.showToast({
        title: "最多只能住" + that.data.max_can_live_num + '人',
        icon: 'none'
      })
    }
    console.log(that.data.guestList);
  },
  /**
   * @bindinput input输入值
   *  */
  bindinput(e) {
    if (e.currentTarget.dataset.input_flag === '0') {
      this.setData({
        ['orderJson.name']: e.detail.value
      })
    } else if (e.currentTarget.dataset.input_flag === '1') {
      this.setData({
        ['orderJson.phone']: e.detail.value
      })
    } else if (e.currentTarget.dataset.input_flag === '2') {
      this.setData({
        ['orderJson.id_no']: e.detail.value
      })
    } else if (e.currentTarget.dataset.input_flag === '6') {
      this.setData({
        ['orderJson.remark']: e.detail.value
      })
    } else if (e.currentTarget.dataset.input_flag === '3') {
      let index = e.currentTarget.dataset.index,
        value = "guestList[" + index + '].name'
      this.setData({
        [value]: e.detail.value
      })
    } else if (e.currentTarget.dataset.input_flag === '4') {
      let index = e.currentTarget.dataset.index,
        value = "guestList[" + index + '].id_no'
      this.setData({
        [value]: e.detail.value
      })
    }


  },
  /** 
   *  @bindDateChange 时间选择器 
   * 
   * */
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
  onLoad: function (options) {
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
      room_building: options.room_building,
      room_floor: options.room_floor,
      max_can_live_num: options.max_can_live_num
    })
    that.get_user_department();
    http.postReq(app.globalData.url_online.url_9101 + 'rate_code/get_rate_code/', {
      "room_type_list": options.room_type,
      "begin_date": that.data.on_date,
      "end_date": that.data.off_date,
      "rate_code": "BAR"
    }, function (res) {
      console.log('请求房价', res.data);
      wx.showToast({
        title: '查询房价中',
        icon: 'none'
      })
      if (res.data.price[that.data.room_type_code][that.data.on_date] || res.data.price[that.data.room_type_code][that.data.on_date] == 0) {
        that.setData({
          price: res.data.price[that.data.room_type_code][that.data.on_date]
        })

      } else {
        that.setData({
          price: 1
        })
        wx.showToast({
          title: '查询房价失败，将默认为1',
          icon: 'none'
        })

        wx.hideLoading();
      }


    });
  },
  /** 
     * @empty_face_to_room 清空当前房间的faceId
    */
  empty_face_to_room(room_number) {
    let url = 'https://equipments.eloadspider.com/v2/equipment/ht/cateye/empty_face_to_room/', params = { 'room_number': room_number };
    http.postReq(url, params, function (res) {
      console.log(res);
      if (res.message == 'success') {
        wx.showToast({
          title: '清空成功',
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '清空失败',
          icon: 'none'
        })
      }
    });
  },
  /** 
   * @add_face_to_room 添加进入当前房间，faceId
  */
  add_face_to_room(room_number, face_url, cb) {
    // cb : res => { console.log(res); }
    let url = 'https://equipments.eloadspider.com/v2/equipment/ht/cateye/add_face_to_room/', params = { 'room_number': room_number, 'face_url': face_url };
    http.postReq(url, params, function (res) {
      console.log(res);
      if (res.message == 'success') {
        wx.showToast({
          title: '添加faceId成功',
          icon: 'none'
        })
        cb(res.data.face_id)
      } else {
        wx.showToast({
          title: '添加faceId失败',
          icon: 'none'
        })
      }
    });
  },
  /** 
   * @get_facephoto_by_public 通过身份证在神盾获取人脸图像
  */
  get_facephoto_by_public(url, params, cb) {
    // cb : res => { console.log(res); }
    /*  测试数据（忽略）
      console.log(hexMD5.hexMD5('76D00D59AB5F42AE99E0711B4F19081F,342427199509182517,'+that.data.on_date+' 12:00:00,7E435E10870D4C2FA42EC0979FC3C07B'));
      
      console.log('76D00D59AB5F42AE99E0711B4F19081F,342427199509182517,2020-04-07 12:00:00,7E435E10870D4C2FA42EC0979FC3C07B' == '76D00D59AB5F42AE99E0711B4F19081F,342427199509182517,'+that.data.on_date+' 12:00:00,7E435E10870D4C2FA42EC0979FC3C07B'); 
    */
    wx.request({
      url: url,
      method: 'post',
      data: params,
      success: function (res) {
        console.log('神盾图像返回', res.data);
        if (res.data.code == '200') {
          return res.data.data;
        } else if (res.data.code == '201') {
          wx.showToast({
            title: params.cardID + '身份未找到相关信息',
            icon: 'none',
            duration: 5000
          })
        } else {
          wx.showToast({
            title: '查询身份失败',
            icon: 'none',
            duration: 4000
          })
        }
      }
    })
  },
  /** 
   * @get_user_department 获取酒店详情信息
   */
  get_user_department() {
    let url = app.globalData.url_online.url_login + 'common/hotel/get_info/' + app.globalData.userInfo.hotel_id;
    // 获取个人部门信息 app.globalData.url_online.url_login + 'common/employee/view_self'
    http.getReq(url, function (res) {

      console.log(res.data);
      that.setData({ "hotel_type": res.data.audit, hotelInfo: res.data })// 酒店类型： 0: 名宿； 1: 酒店

    });
  },
  /**
   * @send_msg 发送短信
   */
  send_msg(params) {
    http.postReq('https://sms.eloadspider.com/v1/authentication/ht/sms/send_message/', params, function (res) {
      console.log(res); // 发送消息是否成功
    });
  },

  /**
   * @order 判断是民宿或者酒店
   */
  order() {
    if (that.data.hotel_type == 0) {
      that.checkin_homestay();
    } else if (that.data.hotel_type == 1) {
      that.order_hotel();
    }
  },

  /**
   * @order_hotel 增加预定
   */
  order_hotel(e) {
    if (that.data.orderJson.name && that.data.orderJson.id_no) {
      if (that.data.orderJson.phone.length == 11) {
        wx.showModal({
          title: '提示',
          content: '请确保入住人和同住人身份证号是正确的',
          success(res) {
            if (res.confirm) {
              wx.showToast({
                title: '预定中',
                icon: 'none'
              })

              /* 请求房价 */
              let room_type = [];
              room_type.push(that.data.room_type_code);
              http.postReq(app.globalData.url_online.url_9101 + 'rate_code/get_rate_code/', {
                "room_type_list": room_type,
                "begin_date": that.data.on_date,
                "end_date": that.data.off_date,
                "rate_code": "BAR"
              }, function (res) {
                console.log('请求房价', res.data);
                wx.showToast({
                  title: '查询房价中',
                })
                wx.showLoading();
                that.setData({
                  price: res.data.price[that.data.room_type_code][that.data.on_date]
                })
               /** 
                * 
                * 老的接口，关于酒店预定
                * 后端接口提供者：邓玉林 
                * 
                **/  
               let params = {
                  "reserve_base": {
                    "telephone_master": that.data.orderJson.name,
                    "biz_date": that.data.on_date,
                    "arr_time": that.data.on_date + ' 12:00:00',
                    "leave_time": that.data.off_date + ' 12:00:00',
                    "rsv_person_name": that.data.orderJson.name,
                    "mobile_master": that.data.orderJson.phone,
                    "rate_code": "BAR",
                    "code_market": "SK",
                    "code_src": "SMSK"
                  },
                  "reserve_rate": [
                    {
                      "room_number": that.data.room_number,
                      "room_price": that.data.price,
                      "room_type_code": that.data.room_type_code,
                      "room_count": "1"
                    }
                  ],
                  "reserve_guest": [
                    {
                      "name": that.data.orderJson.name,
                      "id_no": that.data.orderJson.id_no
                    }
                  ],
                };

                console.log(that.data.guestList);
                let name = that.data.orderJson.name;
                for (let i in that.data.guestList) {
                  params.reserve_guest.push({
                    'id_no': that.data.guestList[i].id_no,
                    'name': that.data.guestList[i].name,
                  })
                  name += ',' + that.data.guestList[i].name
                }
                let url = app.globalData.url_online.url_9202_v2 + 'booking/add_reserve/';
                http.postReq(url, params, function (res) {
                  console.log(res);

                  if (res.message == 'success') {
                    wx.showToast({
                      title: '预定成功,订单号为' + res.data.order_no,
                      icon: 'none'
                    })
                    var order_no = res.data.order_no;
                    //发送消息
                    that.send_msg({
                      phone_number: that.data.orderJson.phone,
                      sign_name: "皇冠晶品酒店服务中心",
                      template_code: "SMS_173405844",
                      template_param: {
                        status: "成功",
                        order: order_no.slice(0, 4) + '****' + order_no.slice(-5, -1),
                        name: name,
                        date: that.data.on_date,
                        hotel: that.data.hotelInfo.full_name,
                        roomtype: that.data.room_type,
                        much: "1",
                        day: getDaysBetween(that.data.on_date, that.data.off_date),
                        money: that.data.price * getDaysBetween(that.data.on_date, that.data.off_date),
                        adress: that.data.hotelInfo.address_1,
                        tel: that.data.hotelInfo.office_tel
                      }
                    });

                    setTimeout(function () {
                      wx.navigateBack({
                        delta: 1
                      })
                    }, 2000)

                  } else {
                    wx.hideLoading();
                    wx.showToast({
                      title: '预定失败',
                      icon: 'none'
                    })
                  }
                });
              });
            }
            else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        }) 
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

  /**
   * @checkin 民宿入住
   * */
  checkin_homestay(e) {
    if (that.data.orderJson.name && that.data.orderJson.id_no) {
      if (that.data.orderJson.phone.length == 11) {
        wx.showModal({
          title: '提示',
          content: '请确保入住人和同住人身份证号是正确的',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定');
              wx.showToast({
                title: '预定中',
                icon: 'none'
              })

              // 清空房间用户faceset
              that.empty_face_to_room(that.data.room_number);

              /* 请求房价 */
              let room_type = [];
              room_type.push(that.data.room_type_code);

              http.postReq(app.globalData.url_online.url_9101 + 'rate_code/get_rate_code/', {
                "room_type_list": room_type,
                "begin_date": that.data.on_date,
                "end_date": that.data.off_date,
                "rate_code": "BAR"
              }, function (res) {
                console.log('请求房价', res.data);
                wx.showToast({
                  title: '查询房价中',
                })
                wx.showLoading();
                if (res.data.price[that.data.room_type_code][that.data.on_date] || res.data.price[that.data.room_type_code][that.data.on_date] == 0) {
                  that.setData({
                    price: res.data.price[that.data.room_type_code][that.data.on_date]
                  })

                  if (that.data.guestList.length) {
                    for (let i in that.data.guestList) {
                      /* 多人入住查看同住人的信息 */
                      wx.request({
                        url: app.globalData.url_online.url_public + 'SDSVCApi/YLShangHai/Get',
                        method: 'post',
                        data: {
                          'type': 1,
                          'keyID': '76D00D59AB5F42AE99E0711B4F19081F', // 用户公钥
                          'cardID': that.data.guestList[i].id_no, // 身份证号
                          'reqTime': that.data.on_date + ' 12:00:00',  // 请求时间
                          'signCode': hexMD5.hexMD5('76D00D59AB5F42AE99E0711B4F19081F,' + that.data.guestList[i].id_no + ',' + that.data.on_date + ' 12:00:00,7E435E10870D4C2FA42EC0979FC3C07B') // MD5加密：校验码(“keyID,cardID,reqTime,AppSecret”)
                        },
                        success: function (res) {
                          console.log('神盾图像返回', res.data);
                          if (res.data.code == '200') {
                            let base64Data = res.data.data; // 返回的是base64 
                            base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data));
                            const base64ImgUrl = "data:image/png;base64," + base64Data;
                            base64src(base64ImgUrl, res => {
                              console.log(res); // 返回图片地址，直接赋值到image标签即可
                              wx.uploadFile({
                                url: 'https://oss.crowncrystalhotel.com/resource/faceid/upload',
                                filePath: res,
                                name: 'file',
                                header: {
                                  'Content-Type': 'multipart/form-data',
                                  'authorization': app.globalData.codeInfo.new_authorization
                                },
                                success(res) {
                                  const data = JSON.parse(res.data);
                                  console.log(JSON.parse(res.data))
                                  let face_url = data.complete;
                                  that.data.guestList[i].face_url = face_url;
                                  if (data.message == 'success') {
                                    let url = app.globalData.url_online.url_eq + 'equipment/ht/cateye/add_face_to_room/', params = { 'room_number': that.data.room_number, 'face_url': face_url };
                                    http.postReq(url, params, function (res) {
                                      console.log(res);
                                      if (res.message == 'success') {
                                        wx.showToast({
                                          title: '添加faceId成功',
                                          icon: 'none'
                                        })
                                        let faceId = res.data.face_id;

                                        that.data.guestList[i].faceId = faceId;

                                        that.setData({
                                          guestList: that.data.guestList
                                        })
                                        console.log("that.data.guestList" + i, that.data.guestList)
                                      } else {
                                        wx.showToast({
                                          title: '添加faceId失败',
                                          icon: 'none'
                                        })
                                      }
                                    });
                                    wx.hideLoading({
                                      complete: (res) => { },
                                    })
                                  } else {
                                    wx.showToast({
                                      title: data.data,
                                      icon: 'none',
                                      duration: 5000
                                    })
                                  }
                                }
                              })
                            });
                          } else if (res.data.code == '201') {
                            wx.showToast({
                              title: that.data.orderJson.id_no + '身份未找到相关信息',
                              icon: 'none',
                              duration: 5000
                            })
                            setTimeout(function () {
                              wx.hideLoading();
                            }, 5000)
                          } else {
                            wx.showToast({
                              title: '查询身份失败',
                              icon: 'none',
                              duration: 4000
                            })

                            setTimeout(function () {
                              wx.hideLoading();
                            }, 5000)
                          }
                        }
                      })
                    }
                  }

                  setTimeout(() => {
                    wx.request({
                      url: app.globalData.url_online.url_public + 'SDSVCApi/YLShangHai/Get',
                      method: 'post',
                      data: {
                        'type': 1,
                        'keyID': '76D00D59AB5F42AE99E0711B4F19081F', // 用户公钥
                        'cardID': that.data.orderJson.id_no, // 身份证号
                        'reqTime': that.data.on_date + ' 12:00:00',  // 请求时间
                        'signCode': hexMD5.hexMD5('76D00D59AB5F42AE99E0711B4F19081F,' + that.data.orderJson.id_no + ',' + that.data.on_date + ' 12:00:00,7E435E10870D4C2FA42EC0979FC3C07B') // MD5加密：校验码(“keyID,cardID,reqTime,AppSecret”)
                      },
                      success: function (res) {
                        console.log('神盾图像返回', res.data);
                        if (res.data.code == '200') {
                          let base64Data = res.data.data; // 返回的是base64 
                          base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data));
                          const base64ImgUrl = "data:image/png;base64," + base64Data;
                          console.log(base64ImgUrl);
                          base64src(base64ImgUrl, res => {
                            console.log(res); // 返回图片地址，直接赋值到image标签即可
                            wx.uploadFile({
                              url: 'https://oss.crowncrystalhotel.com/resource/faceid/upload',
                              filePath: res,
                              name: 'file',
                              header: {
                                'Content-Type': 'multipart/form-data',
                                'authorization': app.globalData.codeInfo.new_authorization
                              },
                              success(res) {
                                const data = JSON.parse(res.data);
                                console.log(JSON.parse(res.data))
                                let face_url = data.complete;
                                if (data.message == 'success') {
                                  let url = app.globalData.url_online.url_eq + 'equipment/ht/cateye/add_face_to_room/', params = { 'room_number': that.data.room_number, 'face_url': face_url };
                                  http.postReq(url, params, function (res) {
                                    console.log(res);
                                    if (res.message == 'success') {
                                      wx.showToast({
                                        title: '添加faceId成功',
                                        icon: 'none'
                                      })
                                      let faceId = res.data.face_id;
                                      // 获取faceId
                                      // that.add_face_to_room(that.data.room_number, pic_photo);
  
                                      let params = {
                                        'room_list': [that.data.room_number],
                                        'master_base': [{
                                          'room_type': that.data.room_type,
                                          'room_number': that.data.room_number,
                                          "rate_code": "BAR",
                                          "code_market": "SK",
                                          "code_src": "SMSK",
                                          'code_name': that.data.room_type_code,
                                          'room_type_descript_en': that.data.room_type_code,
                                          "arr_time": that.data.on_date + ' 12:00:00',
                                          "leave_time": that.data.off_date + ' 12:00:00',
  
                                        }],
                                        'master_rtrate': [{
                                          'room_number': that.data.room_number,
                                          'rate_code': "BAR",
                                          'room_type': that.data.room_type,
                                          'price': {
                                            [that.data.on_date]: that.data.price
                                          }
                                        }],
                                        'master_guest': [{
                                          "arr_time": that.data.on_date + ' 12:00:00',
                                          "leave_time": that.data.off_date + ' 12:00:00',
                                          'room_number': that.data.room_number,
                                          'id_code': '01',
                                          'id_no': that.data.orderJson.id_no,
                                          'name': that.data.orderJson.name,
                                          'face_id': faceId,
                                          'pic_photo': face_url,
                                          'telephone': that.data.orderJson.phone
                                        }],
                                        'lock_arrary': {}
                                      };
                                      let name = that.data.orderJson.name;
                                      if (that.data.guestList.length) {
                                        for (let i in that.data.guestList) {
                                          params.master_guest.push({
                                            "arr_time": that.data.on_date + ' 12:00:00',
                                            "leave_time": that.data.off_date + ' 12:00:00',
                                            'room_number': that.data.room_number,
                                            'id_code': '01',
                                            'id_no': that.data.guestList[i].id_no,
                                            'name': that.data.guestList[i].name,
                                            'face_id': that.data.guestList[i].faceId,
                                            'pic_photo': that.data.guestList[i].face_url,
                                            'telephone': ''
                                          })
                                          name += ',' + that.data.guestList[i].name
                                        }
                                      }
                                      console.log(params.master_guest);
                                      let url = app.globalData.url_online.url_9202_v2 + 'checkin/homestay_checkin/';
  
                                      http.postReq(url, params, function (res) {
                                        console.log(res);
                                        wx.hideLoading();
                                        if (res.message == 'success') {
                                          wx.showToast({
                                            title: '增加入住单成功,预定信息已发送至手机号，注意查收',
                                            icon: 'none'
                                          })
  
                                          if (that.data.hotelInfo.office_tel && that.data.hotelInfo.office_tel != null) {
                                            //发送消息
                                            that.send_msg({
                                              phone_number: that.data.orderJson.phone,
                                              sign_name: '皇冠晶品酒店服务中心',
                                              template_code: "SMS_173405844",
                                              template_param: {
                                                status: "成功",
                                                order: '您预约入住' + that.data.hotelInfo.full_name + '，房间号为' + that.data.room_number,
                                                name: name,
                                                date: that.data.on_date,
                                                hotel: that.data.hotelInfo.full_name,
                                                roomtype: that.data.room_type,
                                                much: "1",
                                                day: getDaysBetween(that.data.on_date, that.data.off_date),
                                                money: that.data.price * getDaysBetween(that.data.on_date, that.data.off_date),
                                                adress: that.data.hotelInfo.address_1,
                                                tel: that.data.hotelInfo.office_tel
                                              }
                                            });
                                          } else {
                                            wx.showToast({
                                              title: '请稍后设置酒店主机号码，方便客户联系',
                                              icon: 'none',
                                              duration: 3000
                                            })
                                            //发送消息
                                            that.send_msg({
                                              phone_number: that.data.orderJson.phone,
                                              sign_name: '皇冠晶品酒店服务中心',
                                              template_code: "SMS_173405844",
                                              template_param: {
                                                status: "成功",
                                                order: '您预约入住' + that.data.hotelInfo.full_name + '，房间号为' + that.data.room_number,
                                                name: name,
                                                date: that.data.on_date,
                                                hotel: that.data.hotelInfo.full_name,
                                                roomtype: that.data.room_type,
                                                much: "1",
                                                day: getDaysBetween(that.data.on_date, that.data.off_date),
                                                money: that.data.price * getDaysBetween(that.data.on_date, that.data.off_date),
                                                adress: that.data.hotelInfo.address_1,
                                                tel: '4001600703'
                                              }
                                            });
                                          }
  
  
                                          setTimeout(function () {
                                            wx.navigateBack({
                                              delta: 1
                                            })
                                          }, 3000)
  
                                        } else {
                                          wx.showToast({
                                            title: '预定失败',
                                            icon: 'none'
                                          })
                                        }
                                      });
                                    } else {
                                      wx.showToast({
                                        title: '添加faceId失败',
                                        icon: 'none'
                                      })
                                    }
                                  });
                                  wx.hideLoading({
                                    complete: (res) => { },
                                  })
                                } else {
                                  wx.showToast({
                                    title: data.data,
                                    icon: 'none',
                                    duration: 5000
                                  })
                                }
                              }
                            })
                          });
                        } else if (res.data.code == '201') {
                          wx.showToast({
                            title: that.data.orderJson.id_no + '身份未找到相关信息',
                            icon: 'none',
                            duration: 5000
                          })
                          setTimeout(function () {
                            wx.hideLoading();
                          }, 5000)
                        } else {
                          wx.showToast({
                            title: '查询身份失败',
                            icon: 'none',
                            duration: 4000
                          })
  
                          setTimeout(function () {
                            wx.hideLoading();
                          }, 5000)
                        }
                      }
                    })
                  }, 4000);

                } else {
                  wx.showToast({
                    title: '查询房价失败',
                  })

                  wx.hideLoading();
                }


              });
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        }) 
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
  /**
   * @checkin_homestay_new 新的民宿入住单
  */
 checkin_homestay_new(){
  if (that.data.orderJson.name && that.data.orderJson.id_no) {
    if (that.data.orderJson.phone.length == 11) {
      wx.showModal({
        title: '提示',
        content: '请确保入住人和同住人身份证号是正确的',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定');
            wx.showToast({
              title: '预定中',
              icon: 'none'
            })

            // 清空房间用户faceset
            that.empty_face_to_room(that.data.room_number);

            /* 请求房价 */
            let room_type = [];
            room_type.push(that.data.room_type_code);

            http.postReq(app.globalData.url_online.url_9101 + 'rate_code/get_rate_code/', {
              "room_type_list": room_type,
              "begin_date": that.data.on_date,
              "end_date": that.data.off_date,
              "rate_code": "BAR"
            }, function (res) {
              console.log('请求房价', res.data);
              wx.showToast({
                title: '查询房价中',
              })
              wx.showLoading();
              if (res.data.price[that.data.room_type_code][that.data.on_date] || res.data.price[that.data.room_type_code][that.data.on_date] == 0) {
                that.setData({
                  price: res.data.price[that.data.room_type_code][that.data.on_date]
                })

                if (that.data.guestList.length) {
                  for (let i in that.data.guestList) {
                    /* 多人入住查看同住人的信息 */
                    wx.request({
                      url: app.globalData.url_online.url_public + 'SDSVCApi/YLShangHai/Get',
                      method: 'post',
                      data: {
                        'type': 1,
                        'keyID': '76D00D59AB5F42AE99E0711B4F19081F', // 用户公钥
                        'cardID': that.data.guestList[i].id_no, // 身份证号
                        'reqTime': that.data.on_date + ' 12:00:00',  // 请求时间
                        'signCode': hexMD5.hexMD5('76D00D59AB5F42AE99E0711B4F19081F,' + that.data.guestList[i].id_no + ',' + that.data.on_date + ' 12:00:00,7E435E10870D4C2FA42EC0979FC3C07B') // MD5加密：校验码(“keyID,cardID,reqTime,AppSecret”)
                      },
                      success: function (res) {
                        console.log('神盾图像返回', res.data);
                        if (res.data.code == '200') {
                          let base64Data = res.data.data; // 返回的是base64 
                          base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data));
                          const base64ImgUrl = "data:image/png;base64," + base64Data;
                          base64src(base64ImgUrl, res => {
                            console.log(res); // 返回图片地址，直接赋值到image标签即可
                            wx.uploadFile({
                              url: 'https://oss.crowncrystalhotel.com/resource/faceid/upload',
                              filePath: res,
                              name: 'file',
                              header: {
                                'Content-Type': 'multipart/form-data',
                                'authorization': app.globalData.codeInfo.new_authorization
                              },
                              success(res) {
                                const data = JSON.parse(res.data);
                                console.log(JSON.parse(res.data))
                                let face_url = data.complete;
                                that.data.guestList[i].face_url = face_url;
                                if (data.message == 'success') {
                                  let url = app.globalData.url_online.url_eq + 'equipment/ht/cateye/add_face_to_room/', params = { 'room_number': that.data.room_number, 'face_url': face_url };
                                  http.postReq(url, params, function (res) {
                                    console.log(res);
                                    if (res.message == 'success') {
                                      wx.showToast({
                                        title: '添加faceId成功',
                                        icon: 'none'
                                      })
                                      let faceId = res.data.face_id;

                                      that.data.guestList[i].faceId = faceId;

                                      that.setData({
                                        guestList: that.data.guestList
                                      })
                                      console.log("that.data.guestList" + i, that.data.guestList)
                                    } else {
                                      wx.showToast({
                                        title: '添加faceId失败',
                                        icon: 'none'
                                      })
                                    }
                                  });
                                  wx.hideLoading({
                                    complete: (res) => { },
                                  })
                                } else {
                                  wx.showToast({
                                    title: data.data,
                                    icon: 'none',
                                    duration: 5000
                                  })
                                }
                              }
                            })
                          });
                        } else if (res.data.code == '201') {
                          wx.showToast({
                            title: that.data.orderJson.id_no + '身份未找到相关信息',
                            icon: 'none',
                            duration: 5000
                          })
                          setTimeout(function () {
                            wx.hideLoading();
                          }, 5000)
                        } else {
                          wx.showToast({
                            title: '查询身份失败',
                            icon: 'none',
                            duration: 4000
                          })

                          setTimeout(function () {
                            wx.hideLoading();
                          }, 5000)
                        }
                      }
                    })
                  }
                }

                setTimeout(() => {
                  wx.request({
                    url: app.globalData.url_online.url_public + 'SDSVCApi/YLShangHai/Get',
                    method: 'post',
                    data: {
                      'type': 1,
                      'keyID': '76D00D59AB5F42AE99E0711B4F19081F', // 用户公钥
                      'cardID': that.data.orderJson.id_no, // 身份证号
                      'reqTime': that.data.on_date + ' 12:00:00',  // 请求时间
                      'signCode': hexMD5.hexMD5('76D00D59AB5F42AE99E0711B4F19081F,' + that.data.orderJson.id_no + ',' + that.data.on_date + ' 12:00:00,7E435E10870D4C2FA42EC0979FC3C07B') // MD5加密：校验码(“keyID,cardID,reqTime,AppSecret”)
                    },
                    success: function (res) {
                      console.log('神盾图像返回', res.data);
                      if (res.data.code == '200') {
                        let base64Data = res.data.data; // 返回的是base64 
                        base64Data = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(base64Data));
                        const base64ImgUrl = "data:image/png;base64," + base64Data;
                        console.log(base64ImgUrl);
                        base64src(base64ImgUrl, res => {
                          console.log(res); // 返回图片地址，直接赋值到image标签即可
                          wx.uploadFile({
                            url: 'https://oss.crowncrystalhotel.com/resource/faceid/upload',
                            filePath: res,
                            name: 'file',
                            header: {
                              'Content-Type': 'multipart/form-data',
                              'authorization': app.globalData.codeInfo.new_authorization
                            },
                            success(res) {
                              const data = JSON.parse(res.data);
                              console.log(JSON.parse(res.data))
                              let face_url = data.complete;
                              if (data.message == 'success') {
                                let url = app.globalData.url_online.url_eq + 'equipment/ht/cateye/add_face_to_room/', params = { 'room_number': that.data.room_number, 'face_url': face_url };
                                http.postReq(url, params, function (res) {
                                  console.log(res);
                                  if (res.message == 'success') {
                                    wx.showToast({
                                      title: '添加faceId成功',
                                      icon: 'none'
                                    })
                                    let faceId = res.data.face_id;
                                    // 获取faceId
                                    // that.add_face_to_room(that.data.room_number, pic_photo);

                                    let params = {
                                      'room_list': [that.data.room_number],
                                      'master_base': [{
                                        'room_type': that.data.room_type,
                                        'room_number': that.data.room_number,
                                        "rate_code": "BAR",
                                        "code_market": "SK",
                                        "code_src": "SMSK",
                                        'code_name': that.data.room_type_code,
                                        'room_type_descript_en': that.data.room_type_code,
                                        "arr_time": that.data.on_date + ' 12:00:00',
                                        "leave_time": that.data.off_date + ' 12:00:00',

                                      }],
                                      'master_rtrate': [{
                                        'room_number': that.data.room_number,
                                        'rate_code': "BAR",
                                        'room_type': that.data.room_type,
                                        'price': {
                                          [that.data.on_date]: that.data.price
                                        }
                                      }],
                                      'master_guest': [{
                                        "arr_time": that.data.on_date + ' 12:00:00',
                                        "leave_time": that.data.off_date + ' 12:00:00',
                                        'room_number': that.data.room_number,
                                        'id_code': '01',
                                        'id_no': that.data.orderJson.id_no,
                                        'name': that.data.orderJson.name,
                                        'face_id': faceId,
                                        'pic_photo': face_url,
                                        'telephone': that.data.orderJson.phone
                                      }],
                                      'lock_arrary': {}
                                    };
                                    let name = that.data.orderJson.name;
                                    if (that.data.guestList.length) {
                                      for (let i in that.data.guestList) {
                                        params.master_guest.push({
                                          "arr_time": that.data.on_date + ' 12:00:00',
                                          "leave_time": that.data.off_date + ' 12:00:00',
                                          'room_number': that.data.room_number,
                                          'id_code': '01',
                                          'id_no': that.data.guestList[i].id_no,
                                          'name': that.data.guestList[i].name,
                                          'face_id': that.data.guestList[i].faceId,
                                          'pic_photo': that.data.guestList[i].face_url,
                                          'telephone': ''
                                        })
                                        name += ',' + that.data.guestList[i].name
                                      }
                                    }
                                    console.log(params.master_guest);
                                    let url = app.globalData.url_online.url_9202_v2 + 'checkin/homestay_checkin/';

                                    http.postReq(url, params, function (res) {
                                      console.log(res);
                                      wx.hideLoading();
                                      if (res.message == 'success') {
                                        wx.showToast({
                                          title: '增加入住单成功,预定信息已发送至手机号，注意查收',
                                          icon: 'none'
                                        })

                                        if (that.data.hotelInfo.office_tel && that.data.hotelInfo.office_tel != null) {
                                          //发送消息
                                          that.send_msg({
                                            phone_number: that.data.orderJson.phone,
                                            sign_name: '皇冠晶品酒店服务中心',
                                            template_code: "SMS_173405844",
                                            template_param: {
                                              status: "成功",
                                              order: '您预约入住' + that.data.hotelInfo.full_name + '，房间号为' + that.data.room_number,
                                              name: name,
                                              date: that.data.on_date,
                                              hotel: that.data.hotelInfo.full_name,
                                              roomtype: that.data.room_type,
                                              much: "1",
                                              day: getDaysBetween(that.data.on_date, that.data.off_date),
                                              money: that.data.price * getDaysBetween(that.data.on_date, that.data.off_date),
                                              adress: that.data.hotelInfo.address_1,
                                              tel: that.data.hotelInfo.office_tel
                                            }
                                          });
                                        } else {
                                          wx.showToast({
                                            title: '请稍后设置酒店主机号码，方便客户联系',
                                            icon: 'none',
                                            duration: 3000
                                          })
                                          //发送消息
                                          that.send_msg({
                                            phone_number: that.data.orderJson.phone,
                                            sign_name: '皇冠晶品酒店服务中心',
                                            template_code: "SMS_173405844",
                                            template_param: {
                                              status: "成功",
                                              order: '您预约入住' + that.data.hotelInfo.full_name + '，房间号为' + that.data.room_number,
                                              name: name,
                                              date: that.data.on_date,
                                              hotel: that.data.hotelInfo.full_name,
                                              roomtype: that.data.room_type,
                                              much: "1",
                                              day: getDaysBetween(that.data.on_date, that.data.off_date),
                                              money: that.data.price * getDaysBetween(that.data.on_date, that.data.off_date),
                                              adress: that.data.hotelInfo.address_1,
                                              tel: '4001600703'
                                            }
                                          });
                                        }


                                        setTimeout(function () {
                                          wx.navigateBack({
                                            delta: 1
                                          })
                                        }, 3000)

                                      } else {
                                        wx.showToast({
                                          title: '预定失败',
                                          icon: 'none'
                                        })
                                      }
                                    });
                                  } else {
                                    wx.showToast({
                                      title: '添加faceId失败',
                                      icon: 'none'
                                    })
                                  }
                                });
                                wx.hideLoading({
                                  complete: (res) => { },
                                })
                              } else {
                                wx.showToast({
                                  title: data.data,
                                  icon: 'none',
                                  duration: 5000
                                })
                              }
                            }
                          })
                        });
                      } else if (res.data.code == '201') {
                        wx.showToast({
                          title: that.data.orderJson.id_no + '身份未找到相关信息',
                          icon: 'none',
                          duration: 5000
                        })
                        setTimeout(function () {
                          wx.hideLoading();
                        }, 5000)
                      } else {
                        wx.showToast({
                          title: '查询身份失败',
                          icon: 'none',
                          duration: 4000
                        })

                        setTimeout(function () {
                          wx.hideLoading();
                        }, 5000)
                      }
                    }
                  })
                }, 4000);

              } else {
                wx.showToast({
                  title: '查询房价失败',
                })

                wx.hideLoading();
              }


            });
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      }) 
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


    http.postReq(url, params, function (res) {
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

  }
})
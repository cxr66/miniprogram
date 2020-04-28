// pages/showindex/showindex.js
var app = getApp();
var that = undefined;
const http = require('../../utils/http.js');
const prom = require('../../utils/prom.js');
const AudioContext = require('../../utils/AudioContext.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: { },
    userInfo: { },
    // 设置
    
  },
  /** 
   * @get_hotel_audit 获取酒店详情信息
   */
   get_hotel_audit() {
    let url = app.globalData.url_online.url_login + 'common/hotel/get_info/' + app.globalData.userInfo.hotel_id;
    // 获取个人部门信息 app.globalData.url_online.url_login + 'common/employee/view_self'
    http.getReq(url, function (res) {

      console.log(res.data);
      app.globalData.userInfo.hotel_audit = res.data.audit;
       
        if( res.data.audit){
          that.setData({
            settingList: [{
              desc: '房态',
              link: '/pages/index/index',
              url: '/pages/img/showindex/showindex-roomstatus.png'
            },
            {
              desc: '设备态',
              link: '/pages/equipment/equipment',
              url: '/pages/img/showindex/showindex-equipment.png'
            },
            {
              desc: '会议',
              link: '/pages/place/place',
              url: '/pages/img/showindex/showindex-place.png'
            },
            {
              desc: '统计',
              link: '/pages/detail/expect/expect',
              url: '/pages/img/showindex/showindex-expect.png'
            },
            /* {
              desc: '监管',
              link: '',
              url: '/pages/img/showindex/showindex-watch.png'
            }, */
            {
              desc: '客人',
              link: '/pages/guestform/guestform',
              url: '/pages/img/showindex/showindex-guest.png'
            }, 
            {
              desc: '房情',
              link: '/pages/detail/detail',
              url: '/pages/img/showindex/showindex-detail.png'
            },
            {
              desc: '订单',
              link: '/pages/orderform/orderform',
              url: '/pages/img/showindex/showindex-order.png'
            },
            {
              desc: '开锁记录',
              link: '/pages/locklogs/locklogs',
              url: '/pages/img/showindex/showindex-watch.png'
            },
             /* {
              desc: '民宿订单',
              link: '/pages/homestay/homestayform/homestayform',
              url: '/pages/img/showindex/showindex-order.png'
            }, */
            /* {
              desc: '迷你吧',
              link: '',
              url: '/pages/img/showindex/showindex-miniba.png'
            }, */
          ],
          })
        }else{
          that.setData({
            settingList: [{
              desc: '房态',
              link: '/pages/index/index',
              url: '/pages/img/showindex/showindex-roomstatus.png'
            },
            {
              desc: '设备态',
              link: '/pages/equipment/equipment',
              url: '/pages/img/showindex/showindex-equipment.png'
            },
            {
              desc: '会议',
              link: '/pages/place/place',
              url: '/pages/img/showindex/showindex-place.png'
            },
            {
              desc: '统计',
              link: '/pages/detail/expect/expect',
              url: '/pages/img/showindex/showindex-expect.png'
            },
            /* {
              desc: '监管',
              link: '',
              url: '/pages/img/showindex/showindex-watch.png'
            }, */
            {
              desc: '开锁记录',
              link: '/pages/locklogs/locklogs',
              url: '/pages/img/showindex/showindex-watch.png'
            },
            {
              desc: '客人',
              link: '/pages/guestform/guestform',
              url: '/pages/img/showindex/showindex-guest.png'
            },
            
            /* {
              desc: '自助机订单',
              link: '/pages/zzjform/zzjform',
              url: '/pages/img/showindex/showindex-zzj.png'
            }, */
            {
              desc: '房情',
              link: '/pages/detail/detail',
              url: '/pages/img/showindex/showindex-detail.png'
            },
             {
              desc: '民宿订单',
              link: '/pages/homestay/homestayform/homestayform',
              url: '/pages/img/showindex/showindex-order.png'
            },
            {
              desc: '房价码',
              link: '/pages/zjjindex/zjjpricecode/zjjpricecodelist/zjjpricecodelist',
              url: '/pages/img/zjjindex/icon-pricecode.png'
            }, 
            {
              desc: '白名单',
              link: '/pages/whitelist/whitelist',
              url: '/pages/img/showindex/showindex-guest.png'
            },
            /* {
              desc: '迷你吧',
              link: '',
              url: '/pages/img/showindex/showindex-miniba.png'
            }, */
          ],
          })
        } 
      // that.setData({ "hotel_type": res.data.audit, hotelInfo: res.data })// 酒店类型： 0: 名宿； 1: 酒店

    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    that = this;
    AudioContext.AudioContext('首页');
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }

    that.get_hotel_audit();
   

    let wx_userInfo = wx.getStorageSync('wx_userInfo');
    that.setData({
      wx_userInfo: wx_userInfo
    })
    
    /* http.postReq(app.globalData.url_online.url_login + 'common/employee/view_self', {}, function (res) {
      if (res.data.dept_id && res.data.dept_id.name) {
        that.setData({
          hotel: res.data.hotel_id,
        })
      }
      console.log(res.data);

    }); */
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

    /* http.getReq('http://organ.crowncrystalhotel.com/v1/organization/ht/master_module/get_app/', function (res) {
      console.log('获取模块', res.data);
      
    }); */

    var date1 = new Date(),
      time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();
    http.postReq(app.globalData.url_online.url_9102 + 'report/comprehensive/biz_date_daily_report/', {
      biz_date: time1
    }, function(res) {
      console.log('营收', res.data);
      that.setData({
        daily_report: res.data.result_list.total[0]
      })

    });

    http.getReq(app.globalData.url_online.url_9101 + 'room_status/real_time_situation/', function(res) {
      console.log('经营状况预计', res.data);
      if (res.data) {
        res.data.room_occupy_rate = (res.data.room_count[4].num / res.data.room_count[0].num * 100).toFixed(2)
        that.setData({
          real_time_situation: res.data
        })
      }
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

  },
  // 跳转
  navigate: function(e) {
    let link = e.currentTarget.dataset.link, desc = e.currentTarget.dataset.desc;
    AudioContext.AudioContext(desc);
    wx.navigateTo({
      url: link
    })
  },

})
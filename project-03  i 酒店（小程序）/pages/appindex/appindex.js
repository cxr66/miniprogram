// pages/appindex/appindex.js 
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
    settingList:[]
    // settingList: [{
    //     desc: '酒店管家',
    //     link: '/pages/showindex/showindex',
    //     url: '/pages/img/module/icon-hotel.png'
    //   },
    //   /* {
    //     desc: '商城',
    //     link: '/pages/mallindex/mallindex',
    //     url: '/pages/img/showindex/showindex-equipment.png'
    //   },
    //   {
    //     desc: '控台',
    //     link: '/pages/conindex/conindex',
    //     url: '/pages/img/showindex/showindex-place.png'
    //   }, */
    //   {
    //     desc: '商台',
    //     link: '/pages/zjjindex/zjjindex',
    //     url: '/pages/img/module/icon-mall.png'
    //   },
    //   {
    //     desc: '任务体系',
    //     link: '/pages/mission/mission',
    //     url:'/pages/img/module/icon-mission.png'
    //   },
    //   {
    //     desc: '运台',
    //     link: '/pages/opeindex/opeindex',
    //     url: '/pages/img/module/icon-operate.png'
    //   },
    //   {
    //     desc: '个人中心',
    //     link: '/pages/my/my',
    //     url: '/pages/img/module/icon-user.png'
    //   },
    //   {
    //     desc: '民宿管家',
    //     link: '/pages/showindex/showindex',
    //     url: '/pages/img/module/icon-homestay.png'
    //   }
    // ],
  },
  /** 
   * @get_hotel_audit 获取酒店详情信息
   */
  get_hotel_audit() {
    let url = app.globalData.url_online.url_login + 'common/hotel/get_info/' + app.globalData.userInfo.hotel_id;
    // 获取个人部门信息 app.globalData.url_online.url_login + 'common/employee/view_self'
    http.getReq(url, function (res) {

      console.log(res.data);
      let audit = res.data.audit;// 0 民宿
      if(audit){
        that.setData({
          settingList: [{
            desc: '酒店管家',
            link: '/pages/showindex/showindex',
            url: '/pages/img/module/icon-hotel.png'
          },
          /* {
            desc: '商城',
            link: '/pages/mallindex/mallindex',
            url: '/pages/img/showindex/showindex-equipment.png'
          },
          {
            desc: '控台',
            link: '/pages/conindex/conindex',
            url: '/pages/img/showindex/showindex-place.png'
          }, */
          {
            desc: '商台',
            link: '/pages/zjjindex/zjjindex',
            url: '/pages/img/module/icon-mall.png'
          },
          {
            desc: '任务体系',
            link: '/pages/mission/mission',
            url:'/pages/img/module/icon-mission.png'
          },
          {
            desc: '运台',
            link: '/pages/opeindex/opeindex',
            url: '/pages/img/module/icon-operate.png'
          },
          {
            desc: '个人中心',
            link: '/pages/my/my',
            url: '/pages/img/module/icon-user.png'
          },
          
        ],
        })
      }else{
        that.setData({
          settingList: [{
            desc: '民宿管家',
            link: '/pages/showindex/showindex',
            url: '/pages/img/module/icon-homestay.png'
          },
          /* {
            desc: '商城',
            link: '/pages/mallindex/mallindex',
            url: '/pages/img/showindex/showindex-equipment.png'
          },
          {
            desc: '控台',
            link: '/pages/conindex/conindex',
            url: '/pages/img/showindex/showindex-place.png'
          }, */
          {
            desc: '商台',
            link: '/pages/zjjindex/zjjindex',
            url: '/pages/img/module/icon-mall.png'
          },
          {
            desc: '任务体系',
            link: '/pages/mission/mission',
            url:'/pages/img/module/icon-mission.png'
          },
          {
            desc: '运台',
            link: '/pages/opeindex/opeindex',
            url: '/pages/img/module/icon-operate.png'
          },
          {
            desc: '个人中心',
            link: '/pages/my/my',
            url: '/pages/img/module/icon-user.png'
          },
          
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
    AudioContext.AudioContext('可用模块首页');
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
    let wx_userInfo = wx.getStorageSync('wx_userInfo');
    that.setData({
      wx_userInfo: wx_userInfo
    })
    that.get_hotel_audit();
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // 跳转
  redirect: function(e) {
    let link = e.currentTarget.dataset.link, desc = e.currentTarget.dataset.desc;
    
    wx.redirectTo({
      url: link
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    /* http.getReq('http://organ.crowncrystalhotel.com/v1/organization/ht/master_module/get_app/', function (res) {
      console.log('获取模块', res.data);

    }); */
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
    let link = e.currentTarget.dataset.link,
      desc = e.currentTarget.dataset.desc;
    AudioContext.AudioContext(desc);
 
      wx.navigateTo({
        url: link
      })
 

  },

})
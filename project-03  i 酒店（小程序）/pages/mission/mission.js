// pages/mission/mission.js
var app = getApp();
const AudioContext = require('../../utils/AudioContext.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    missionList:[
      {
        desc:'送物',
        url: '/pages/img/mission/icon-goods.png',
        link: '/pages/mission/goods/goods'
      },
     /*  {
        desc: '送餐',
        url: '/pages/img/mission/icon-foods.png',
        link: '/pages/mission/foods/foods'
      },
      {
        desc: '采购',
        url: '/pages/img/mission/icon-procure.png',
        link: '/pages/mission/procure/procure'
      },
      {
        desc: '班车',
        url: '/pages/img/mission/icon-bus.png',
        link: '/pages/mission/bus/bus'
      },
      {
        desc: '工程配合',
        url: '/pages/img/mission/icon-engineer.png',
        link: '/pages/mission/engineer/engineer'
      },
      {
        desc: '人员协作',
        url: '/pages/img/mission/icon-team.png',
        link: '/pages/mission/team/team'
      }, 
      
      {
        desc: '叫早',
        url: '/pages/img/mission/icon-knock.png',
        link: '/pages/mission/knock/knock'
      },*/
      {
        desc: '呼梯',
        url: '/pages/img/mission/icon-elevator.png',
        link: '/pages/mission/elevator/elevator'
      },
      {
        desc: '开锁',
        url: '/pages/img/mission/icon-lock.png',
        link: '/pages/mission/lock/lock'
      },
      { 
        desc: '陌生人',
        url: '/pages/img/mission/icon-stranger.png',
        link: '/pages/mission/stranger/stranger'
      }, 
      {
        desc: '监控',
        url: '/pages/img/mission/icon-monitor.png',
        link: "/pages/mission/newmonitor/newmonitor"
      },
      {
        desc: '打扫',
        url: '/pages/img/mission/icon-sweep.png',
        link: '/pages/mission/clean/cleanList/cleanList'
      },
      {
        desc: '新闻',
        url: '/pages/img/mission/icon-news.png',
        link: '/pages/mission/news/news'
      },
      {
        desc: '客控',
        url: '/pages/img/mission/icon-room-control.png',
        link: '/pages/mission/roomControl/roomControl'
      },
      
      {
        desc: '蓝牙',
        url: '/pages/img/mission/icon-engineer.png',
        link: '/pages/bluetooth/bluetooth'
      },
    ]
  },
  // 跳转
  navigate: function (e) {
    let link = e.currentTarget.dataset.link, desc = e.currentTarget.dataset.desc;
    AudioContext.AudioContext(desc);
    wx.navigateTo({
      url: link
    })
    /* if (app.globalData.codeInfo.root_level == 0 && desc != '呼梯' && desc != '开锁'){
      wx.showToast({
        title: '您没有权限进入该模块',
        icon: 'none'
      })
    }else{
      wx.navigateTo({
        url: link
      })
    } */
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    AudioContext.AudioContext('任务管理中心');
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
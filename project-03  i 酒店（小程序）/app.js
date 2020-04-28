//app.js
let that = undefined;
const AudioContext = require('utils/AudioContext.js');
/* "tabBar": {
    "color": "#A79F9C",
    "selectedColor": "#4B8CF0",
    "borderStyle": "black",
    "backgroundColor": "#fff",
    "list": [
      {
        "pagePath": "pages/showindex/showindex",
        "iconPath": "/pages/img/tab-index.png",
        "selectedIconPath": "/pages/img/tab-index-selected.png",
        "text": "首页"
      },
      {
        "pagePath": "pages/mission/mission",
        "iconPath": "/pages/img/tab-mission.png",
        "selectedIconPath": "/pages/img/tab-mission-selected.png",
        "text": "任务"
      },
      {
        "pagePath": "pages/my/my",
        "iconPath": "/pages/img/tab-my.png",
        "selectedIconPath": "/pages/img/tab-my-selected.png",
        "text": "我的"
      }
    ]
  },*/
App({
  changeTabBar: function () {
    var _curPageArr = getCurrentPages();
    var _curPage = _curPageArr[_curPageArr.length - 1];
    var _pagePath = _curPage.__route__;
    if (_pagePath.indexOf('/') != 0) {
      _pagePath = '/' + _pagePath;
    }
    var tabBar = this.tabBar;
    // console.log(this.tabBar); 
    for (var i = 0; i < tabBar.list.length; i++) {
      // console.log(_pagePath + '--' + tabBar.list[i].pagePath)
      tabBar.list[i].selected = false;
      if (tabBar.list[i].pagePath == _pagePath) {
        tabBar.list[i].selected = true;//根据页面地址设置当前页面状态  
      }
    }
    _curPage.setData({
      tabbar: tabBar
    });
  }, 

  onLaunch: function() {
    that = this;

    if (wx.getStorageSync('codeInfo')){
      // 展示本地存储能力
      that.globalData.codeInfo = wx.getStorageSync('codeInfo');
    }
    if (wx.getStorageSync('userInfo')){
      that.globalData.userInfo = wx.getStorageSync('userInfo');
    }
    console.log(that.globalData.codeInfo); 
    // 获取使用环境
    wx.getSystemInfo({
      success: function(res) {
        if (res.platform == "devtools") {
          console.log("PC");
        } else if (res.platform == "ios") {
          console.log("IOS");
        } else if (res.platform == "android") {
          console.log("android");
        }
        that.globalData.systemInfo = res;
        that.globalData.platform = res.platform;
      }
    })
    // 更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function(res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function() {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function(res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate();
                }
              }
            })
          })
          updateManager.onUpdateFailed(function() {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，为您更新失败，请您删除当前小程序，重新搜索进入',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    } 
  },

  /* 年月日时分秒 */
  getNowFormatDate() {//获取当前时间
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + " " + date.getHours() + seperator2 + date.getMinutes()
      + seperator2 + date.getSeconds();
    return currentdate;
  },
   /* 发送服务通知函数封装 */ 
  formsubmitfunc: function(formid, template_id, templatedata, page, geterUnionId, geteropenid) {
    templatedata = JSON.stringify(templatedata);
    wx.request({
      url: " ",
      data: {
        senderOpenId: that.globalData.userInfo.openId, //发送人的openid
        touser: geteropenid, //接送用户的openid
        geterUnionId: geterUnionId, //接受人的unionid
        template_id: template_id, //申请的模板消息id，位置在微信公众平台/模板消息中添加并获取
        page: page, //点击通知跳转的页面
        form_id: formid, //表单提交场景下，为 submit 事件带上的 formId
        templateData: templatedata, //此处必须为data,只有人说value也可以,可能官方已经修复这个bug 
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }, //请求头,也可以没有
      success: function(res) {
        console.log(res, "push msg");
        that.globalData.formIdArray = "";
      },
      fail: function(err) {
        console.log(err, "push err");
      }
    });
  },

  // 全局变量
  globalData: {
    url_header:'',
    roomType:{},
    codeInfo: null,//自住后台信息
    userInfo: null, //微信登录信息
    systemInfo: null, //系统信息
    platform: null, //平台信息
    url_online: {
      url_login: 'http://47.98.113.173:9519/v1/' ,
      url_9101: 'http://47.98.113.173:9107/v1/room/',
      url_9102: 'http://47.98.113.173:9107/v1/',
      url_9103: 'http://47.98.113.173:9107/v1/', 
      url_9104: 'http://47.98.113.173:9104/v1/',
      url_9202: 'http://47.98.113.173:9202/v1/',
      url_8091: 'http://47.98.113.173:8091/v1/',
      url_9109: 'http://47.98.113.173:9101/v1/',
      url_eq: 'https://equipments.crowncrystalhotel.com/v2/',
      url_9503: 'http://47.98.113.173:9503/v1/',
      // url_img: 'https://image.eloadspider.com',
      url_img: 'https://ispider-oss.oss-cn-hangzhou.aliyuncs.com/',
      url_monitor: 'http://47.98.113.173:8082/v1/', 
    },

    url_online: { 
      url_login:'https://login.eloadspider.com/v1/',
      url_9101: 'https://ispider.eloadspider.com/v1/room/',
      url_9102: 'https://ispider.eloadspider.com/v1/',
      url_9103: 'https://ispider.eloadspider.com/v1/',
      url_machine: 'https://machine.crowncrystalhotel.com/v1/',
      url_9104: 'https://ispider.eloadspider.com/v1/task/',
      url_9202: 'https://bill.eloadspider.com/v1/',
      url_9202_v2: 'https://bill2.crowncrystalhotel.com/v2/',
      url_8091: 'https://room.eloadspider.com/v1/',
      url_9109: 'https://price.eloadspider.com/v1/',
      url_eq:   'https://equipments.eloadspider.com/v2/',
      url_9503: 'https://duty.eloadspider.com/v1/',
      // url_img: 'https://image.eloadspider.com',
      url_img: 'https://ispider-oss.oss-cn-hangzhou.aliyuncs.com/',
      url_monitor: 'https://elevators.eloadspider.com/v1/',
      url_sms:'https://sms.eloadspider.com/v1/',
      url_public: 'https://www.sdlockpf.cn:19943/'
    }
  }
})
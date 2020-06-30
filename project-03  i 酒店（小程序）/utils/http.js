var app = getApp();

/** 
 * A JavaScript For Request: （当前公共请求封装的很潦草, 后期重写的时候请抛弃, 自己都看不下去, 无参考价值）
  
 * 使用注意事项: 在小程序在需要的页面引入js
  
  * author: cxr
*/
function getReq(url, cb) {
  wx.showLoading();
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'authorization': app.globalData.codeInfo.new_authorization,
      "content-type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      if (res.data.new_authorization) {
        app.globalData.codeInfo.new_authorization = res.data.new_authorization;
        wx.setStorageSync('codeInfo', app.globalData.codeInfo);
      }

      switch (res.data.message) {
        case 'success':
          return typeof cb == "function" && cb(res.data);
          break;

        case 'authorization invalid':
          app.globalData.userInfo = {};
          app.globalData.codeInfo = {};
          wx.showToast({
            title: '认证失效',
            icon:'none',
            duration: 1500
          })
          setTimeout(function(){
            wx.reLaunch({
              url: '/pages/logins/logins',
            })
          },1500)
          break;

        case 'access refused 6':
          wx.showToast({
            title: '权限不足,部分展示且不可操作',
            icon: 'none',
            duration: 3000
          })
          break;

        default:
          wx.showToast({
            title: '服务出错,错误原因：' + res.data.message,
            icon: "none"
          })
      }
    },
    fail: function () {
      wx.showToast({
        title: '后台出错',
        icon:'none',
        duration: 1500
      })
      setTimeout(function(){
        wx.reLaunch({
          url: '/pages/logins/logins',
        })
      },1500)
      return typeof cb == "function" && cb(false);
    },
    complete: function () {
      wx.hideLoading();
    }
  })
}

function getDataReq(url, params, cb) {
  wx.showLoading();
  wx.request({
    url: url,
    method: 'GET',
    data: params,
    header: {
      'authorization': app.globalData.codeInfo.new_authorization
    },
    success: function (res) {
      if (res.data.new_authorization) {
        app.globalData.codeInfo.new_authorization = res.data.new_authorization;
        wx.setStorageSync('codeInfo', app.globalData.codeInfo);
      }

      switch (res.data.message) {
        case 'success':
          return typeof cb == "function" && cb(res.data);
          break;

        case 'authorization invalid':
          app.globalData.userInfo = {};
          app.globalData.codeInfo = {};
          wx.showToast({
            title: '认证失败',
            icon:'none',
            duration: 1500
          })
          setTimeout(function(){
            wx.reLaunch({
              url: '/pages/logins/logins',
            })
          },1500)
          break;

        case 'access refused 6':
          wx.showToast({
            title: '权限不足，部分展示且不可操作',
            icon: 'none',
            duration: 3000
          })
          break;

        default:
          wx.showToast({
            title: '服务出错,错误原因：' + res.data.message,
            icon: "none"
          })
      }
    },
    fail: function () {
      wx.showToast({
        title: '后台出错',
        icon:'none',
        duration: 1500
      })
      setTimeout(function(){
        wx.reLaunch({
          url: '/pages/logins/logins',
        })
      },1500)
      return typeof cb == "function" && cb(false);
    },
    complete: function () {
      wx.hideLoading();
    }
  })
}

function postReq(url, data, cb) {
  wx.showLoading();
  wx.request({
    url: url,
    header: {
      'content-type': 'application/json',
      'authorization': app.globalData.codeInfo.new_authorization
    },
    data: data,
    method: 'post',
    success: function (res) {
      if (res.data.new_authorization) {
        app.globalData.codeInfo.new_authorization = res.data.new_authorization;
        wx.setStorageSync('codeInfo', app.globalData.codeInfo);
      }

      switch (res.data.message) {
        case 'success':
          return typeof cb == "function" && cb(res.data);
          break;

        case 'authorization invalid':
          app.globalData.userInfo = {};
          app.globalData.codeInfo = {};
          wx.showToast({
            title: '认证失效',
            icon:'none',
            duration: 1500
          })
          setTimeout(function(){
            wx.reLaunch({
              url: '/pages/logins/logins',
            })
          },1500)
          break;

        case 'access refused 6':
          wx.showToast({
            title: '权限不足，部分展示且不可操作',
            icon: 'none',
            duration: 3000
          })
          break;

        default:
          wx.showToast({
            title: '服务出错,错误原因：' + res.data.message,
            icon: "none"
          })
      }
    },
    fail: function () {
      wx.showToast({
        title: '后台出错',
        icon:'none',
        duration: 1500
      })
      setTimeout(function(){
        wx.reLaunch({
          url: '/pages/logins/logins',
        })
      },1500)
      return typeof cb == "function" && cb(false)
    },
    complete: function () {
      wx.hideLoading();
    }
  })
}

module.exports = {
  getReq: getReq,
  getDataReq: getDataReq,
  postReq: postReq,
}
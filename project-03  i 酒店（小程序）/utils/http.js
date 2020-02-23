var app = getApp();

function getReq(url, cb) {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      'authorization': app.globalData.codeInfo.new_authorization,
      "content-type": "application/x-www-form-urlencoded"
    },
    success: function(res) {
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
      return typeof cb == "function" && cb(false);
    }
  })
}

function getDataReq(url, params, cb) {
  wx.request({
    url: url,
    method: 'GET',
    data: params,
    header: {
      'authorization': app.globalData.codeInfo.new_authorization
    },
    success: function(res) {
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
          wx.reLaunch({
            url: '/pages/logins/logins',
          })
          break;

        case 'access refused 6':
          wx.showToast({
            title: '权限不足，部分展示且不可操作',
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
      return typeof cb == "function" && cb(false);
    }
  })
}

function postReq(url, data, cb) {
  wx.request({
    url: url,
    header: {
      'content-type': 'application/json',
      'authorization': app.globalData.codeInfo.new_authorization
    },
    data: data,
    method: 'post',
    success: function(res) { 
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
          wx.reLaunch({
            url: '/pages/logins/logins',
          })
          break;

        case 'access refused 6':
          wx.showToast({
            title: '权限不足，部分展示且不可操作',
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
      return typeof cb == "function" && cb(false)
    }
  })
}

module.exports = {
  getReq: getReq,
  getDataReq: getDataReq,
  postReq: postReq,
}
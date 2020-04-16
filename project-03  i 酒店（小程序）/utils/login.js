var app = getApp();

function userLogin() {
  //调用登录接口
  wx.login({
    success: function(res) {
      var code = res.code; //登录凭证
      // console.log("登录凭证" + code);
      if (code) {
        //授权
        wx.getSetting({
          success(res1) {
            // console.log(res1.authSetting);
            if (res1.authSetting['scope.userInfo']) {
              // 用户已经同意小程序获得用户信息，后续调用 wx.getUserInfo 接口不会弹窗询问
              //2、调用获取用户信息接口
              var that = this;
              wx.getUserInfo({
                success: function(res) {
                  //  console.log({ encryptedData: res.encryptedData, iv: res.iv, code: code });
                  //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
                  wx.request({
                    url: '', //服务接口地址
                    method: 'post',
                    header: {
                      'content-type': 'application/json'
                    },
                    data: {
                      'code': code,
                      "userInfo": res
                    },
                    success: function(data) {
                      //4.解密成功后 获取自己服务器返回的结果
                      if (data.data.userInfo) {
                        app.globalData.userInfo = data.data.userInfo;
                        wx.setStorageSync('userInfo', data.data.userInfo);
                      } else {
                        wx.showToast({
                          title: '登录失败',
                          icon: "none"
                        })
                      }
                    },
                    fail: function() {
                      console.log('系统错误');
                      wx.showToast({
                        title: '登录失败',
                        icon: "none"
                      })
                    }
                  })
                },
                fail: function() {
                  console.log('获取用户信息失败');
                  wx.showToast({
                    title: '登录失败',
                    icon: "none"
                  })
                }
              })


            }
          }
        })

      } else {
        console.log('获取用户登录态失败！' + r.errMsg)
      }
    },
    fail: function() {
      console.log('登陆失败')
    }
  });
}

module.exports = {
  userLogin: userLogin
}
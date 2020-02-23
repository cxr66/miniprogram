// 发送请求
function postdata(urlparms, data, success, fail) {
  wx.request({
    url: headurl + urlparms,
    method: "POST",
    data: data,
    header: {
      // 'content-type': "application/x-www-form-urlencoded",
      'userId': getApp().userinfo.userId
    },
    success: res => success(res),
    fail: res => fail && fail(res)
  })
}

module.exports = {
  postdata: postdata
}
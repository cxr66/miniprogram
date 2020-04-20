/*
  * A JavaScript Of The WeChat Miniprogram For The Network Request 

  * See http://pajhome.org.uk/site/legal.html for details.
  * 
  * author: cxr
*/

/**
 *@header 请求头
 */
var header = {
  'content-type': 'application/x-www-form-urlencoded',
  'Authorization': app.globalData.codeInfo.new_authorization,
}

/**
 * function: 封装网络请求
 * @url URL地址
 * @params 请求参数
 * @method 请求方式：GET/POST
 * @onSuccess 成功回调
 * @onFailed  失败回调
 **/

function request(url, params, method, onSuccess, onFailed) {
  console.log('请求url：' + url);
  wx.showLoading({
    title: "正在加载中...",
  })
  console.log("请求头：", header)
  wx.request({
    url: url,
    data: dealParams(params),
    method: method,
    header: header,
    success: function (res) {
      wx.hideLoading();
      console.log('响应：', res.data);

      /** start 根据需求 接口的返回状态码进行处理 */
      if (res.data.message == 'success') {
        onSuccess(res.data);        //request success
      } else {
        onFailed(res.data.message); //request failed
      }
      /** end 处理结束*/

    },
    fail: function (error) {
      onFailed(""); //failure for other reasons
    }
  })
}

/**
 *@post 供外部post请求调用  
 **/
function post(url, params, onSuccess, onFailed) {
  console.log("请求方式：", "POST")
  request(url, params, "POST", onSuccess, onFailed);

}

/**
 *@get 供外部get请求调用
 **/
function get(url, params, onSuccess, onFailed) {
  console.log("请求方式：", "GET")
  request(url, params, "GET", onSuccess, onFailed);
}

/**
 * function: 根据需求如果需要处理请求参数，譬如添加某固定参数配置等
 * 对参数进行处理
 * @params 请求参数
 */
function dealParams(params) {
  console.log("请求参数:", params)
  return params;
}


// 1.通过module.exports方式提供给外部调用
module.exports = {
  postRequest: post,
  getRequest: get,
}


/**
 * 2.在外部文件调用该JS
 *
 * const request = require('request.js');
 * var params = {
        name: "张三",
    };
    request.postRequest("https://www.baidu.com", params,
      function(res) {
        // success回调
      },
      function(err) {
        // fail回调
      }
    )
 * **/
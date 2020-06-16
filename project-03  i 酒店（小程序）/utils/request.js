/**

* 接口请求基类方法

* @param method 请求方法 必填

* @param url 请求路径 必填

* @param data 请求参数

* @param header 请求头 选填

* @returns {Promise}

*/

//请求接口函数
function request(method, url, data, loading) {
	let header = { 
		'authorization': app.globalData.codeInfo.new_authorization
	}; 
	
	return new Promise((resolve, reject) => {
		//显示加载动画
		if (loading) wx.showLoading(); 
		//发起请求
		wx.request({
			url,
			method,
			data,
			header,
			success: res => {
        let message = res.data.message;
        if (res.data.new_authorization) {
          app.globalData.codeInfo.new_authorization = res.data.new_authorization;
          wx.setStorageSync('codeInfo', app.globalData.codeInfo);
        }
        //统一处理返回值
        switch (message) {
          case 'success':
            resolve(res.data)
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
			fail: err => {
				reject(err)
			},
			complete: () => {
				//结束加载动画
				if (loading) wx.hideLoading()
			}
		});
	})
	
}

export default {
	get: function(url, params, loading) {
		return request('GET', url, params, loading)
	},
	post: function(url, params, loading) {
		return request('POST', url, params, loading)
	},
	put: function(url, params, loading) {
		return request('PUT', url, params, loading)
	},
	delete: function(url, params, loading) {
		return request('DELETE', url, params, loading)
	}
}

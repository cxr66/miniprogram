// pages/whitelist/addwhitelist/addwhitelist.js

var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
/* 添加人脸错误字典 */
const addErrorDict = {
  3:  'json格式解析失败',
  6: 'base64解码失败',
  7: '缩放后的人脸图片编码base64失败',
  10001: '加载图片失败',
  10002: '分配内存失败',
  10003: '图片太大',
  10007: '人脸多于1个',
  10008: '没检测到人脸',
  10009: '人脸小于112*96',
  10011: '人脸质量不佳',
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addPerData:{
      name:'',
      id:''
    }
  },
/**
   * @bindinput input输入值
   *  */
  bindinput(e) {
    if (e.currentTarget.dataset.flag === '0') {
      this.setData({
        ['addPerData.name']: e.detail.value
      })
    } else if (e.currentTarget.dataset.flag === '1') {
      this.setData({
        ['addPerData.id']: e.detail.value
      })
    }  
  },
  /**
   * @addPer 新增员工
   */
  addPer: function (e) {
    console.log('新增白名单');
    let url = app.globalData.url_online.url_9503 + 'camera/server/add_face' ;

    if(that.data.addPerData.name && that.data.addPerData.id ){
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          wx.showLoading();
          console.log(tempFilePaths);
          wx.uploadFile({
            filePath: tempFilePaths[0],
            name: 'file',
            url: 'https://oss.crowncrystalhotel.com/resource/employee/upload',
            success (res) { 
      
              console.log(JSON.parse(res.data));
              if(res.statusCode == 200){
                wx.showToast({
                  title: '上传图片成功',
                  icon: 'none'
                })
                wx.hideLoading();
                let params = {
                  "name":that.data.addPerData.name,
                  "id_card_num": that.data.addPerData.id,
                  "jpg_file": JSON.parse(res.data).url,
                  "source": 1
              };
              console.log(params);
              
                wx.request({
                  url: url,
                  method: 'post',
                  data:params,
                  header: {
                    'authorization': app.globalData.codeInfo.new_authorization,  
                  },
                  success: function(res) {
                    console.log(res.data)
                    if (res.data.new_authorization) {
                      app.globalData.codeInfo.new_authorization = res.data.new_authorization;
                      wx.setStorageSync('codeInfo', app.globalData.codeInfo);
                    }
                    
                    switch (res.data.message) {
                      case 'success': 
                          wx.showToast({
                            title: '添加成功',
                            icon: 'none'
                          }) 
                        break;
                      
                      case 'fail': 
                        wx.showToast({
                          title: '添加失败,'+addErrorDict[res.data.data[0].result],
                          icon: 'none'
                        }) 
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
                  }
                })
              }else{
                wx.showToast({
                  title: '上传图片失败,请稍后重试',
                  icon: 'none'
                })
              }
              
              
            }
          })
        }
      })
    }else{
      wx.showToast({
        title: '用户名称和ID必须填写',
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this
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
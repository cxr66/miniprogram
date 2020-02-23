// pages/search/search.js
var app = getApp(),
  that = undefined;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_value: '',
    // 筛选条件
    check_index: -1,
    check_modal: false,
    check_list: [
      {
        name: '日期筛选',
        checked: true,
        list: []
      },
      {
        name: '时间筛选',
        checked: false,
        list: [
          {
            desc: "上午"
          },
          {
            desc: "下午"
          }
        ]
      }
    ],
  },
  // 点击筛选
  click_check(e) {
    var index = e.currentTarget.dataset.index;
    if (that.data.check_index === index || index === 'index') {
      that.setData({
        check_index: ''
      })
    } else {
      that.setData({
        check_index: index
      })
    }
  },
  //点击选中放入筛选数组
  choose_check(e) {
    var name = e.currentTarget.dataset.name,
      index = e.currentTarget.dataset.index;

    // 判断更改状态
    if (that.data.check_list[that.data.check_index].list[index].hoverClass == 0 || that.data.check_list[that.data.check_index].list[index].hoverClass == undefined) {
      that.data.check_list[that.data.check_index].list[index].hoverClass = 1;
    } else {
      that.data.check_list[that.data.check_index].list[index].hoverClass = 0;
    }
    that.setData({
      check_list: that.data.check_list
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    that = this;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  }
})
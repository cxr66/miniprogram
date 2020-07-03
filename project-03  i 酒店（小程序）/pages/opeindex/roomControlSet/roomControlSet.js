// pages/opeindex/roomControlSet/roomControlSet.js 
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    room_num: '', 
    manConstIndex: 0,// 厂家
    roomSettingIndex: 0,// 客控设置：单键，双键等
    switchCodeIndex: 0,// 开关显示信息
    modal: true,
    setmodal:true,
    roomList: [
      {
        room_no: 8001
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    that.queryRoomNo();
  },

  /* 获取房间号 */
  queryRoomNo() {
      wx.showLoading({
        title: '正在查询',
      })
      http.getReq(app.globalData.url_online.url_eq + 'equipment/ht/room/get_room/', function (res) {
        console.log('查询房间', res.data);
        that.setData({
          roomList: res.data.results
        })
        wx.hideLoading(); 

      });

  },

  /**
   * @getRoomSetData 请求基础参数和厂家
   * */  
  getRoomSetData(e){
    that.openOrOffModal();
    that.data.room_number = e.currentTarget.dataset.roomno;
    http.getReq(app.globalData.url_online.url_eq + 'equipment/setting/switch_panel/get_switch_panel_list/', function (res) {
      console.log('获取基础参数', res.data.switch_panel);
      that.setData({
        roomSettingList: res.data.switch_panel,
        lightShowList: res.data.manufacture
      })
      wx.hideLoading(); 
    });

    http.getReq(app.globalData.url_online.url_eq + 'equipment/ht/room/get_man_const/', function (res) {
      console.log('获取厂家列表', res.data.manufacture);
      that.setData({
        manConstList: res.data.manufacture
      })
      wx.hideLoading(); 
    });
  },
  /** 
   *@addRoomSetPost  新增客控设置 
   */
  addRoomSetPost(){ 
    if(that.data.switch_codes.length){ 
      console.log(that.data.switch_codes);
      http.postReq(app.globalData.url_online.url_eq + 'equipment/setting/switch_panel/add_switch_panel_and_code/', {
        "room_number":that.data.room_number,
        "number_of_keys":that.data.roomSettingList[that.data.roomSettingIndex].number_of_keys,
        "manufacture": that.data.manConstList[that.data.manConstIndex].const,
        "switch_codes": that.data.switch_codes
    }, function (res) {
        console.log('设置客控成功', res);
        that.openOrOffModal();
        wx.showToast({
          title: '设置客控成功',
        })
        that.setData({
          modal: true,
          setmodal: true
        })
      });
    }else{
      wx.showToast({
        title: '参数缺失',
        icon: 'none'
      })
    }
    
  },
  openOrOffModal(){
    that.setData({
      modal: !that.data.modal
    })
  },
  switchsetmodal(){
    that.openOrOffModal();
    let number_of_keys =  that.data.roomSettingList[that.data.roomSettingIndex].number_of_keys+'',keysNum;
    if(that.data.roomSettingList){
       keysNum = parseInt(number_of_keys.slice(0,1))+1
    } 
    console.log(keysNum);
    let switch_codes = [],switch_code_detail_list = [];
    for(let i = 0;i< keysNum;i++){
      switch_codes.push({
            "code_name": that.data.lightShowList[0].switch_code,   //# 开关显示信息
            "switch_code": ""  //#  开关键值
        })
        switch_code_detail_list.push({switch_code_detail:that.data.lightShowList[0].switch_code_detail})
    }
    that.setData({
      setmodal: !that.data.setmodal,
      switch_codes: switch_codes,
      switch_code_detail_list: switch_code_detail_list
    })
  },

  bindinput(e) {
    console.log(e.currentTarget.dataset.index);
    let index = e.currentTarget.dataset.index,cgkey = 'switch_codes['+index+'].switch_code';
    
    this.setData({ 
      [cgkey]: e.detail.value
    })
    console.log(that.data.switch_codes)
  },
// 选择房务人员
bindPickerChange(e) {
  if (e.currentTarget.dataset.flag == '1') {
    this.setData({
      manConstIndex: e.detail.value
    })
  } else if (e.currentTarget.dataset.flag == '2') {
    this.setData({
      roomSettingIndex: e.detail.value
    })
  } else if (e.currentTarget.dataset.flag == '3') {
    console.log(e.currentTarget.dataset.index);
    let index = e.currentTarget.dataset.index,cgkey = 'switch_codes['+index+'].code_name',cgvalue = 'switch_code_detail_list['+index+'].switch_code_detail';
    
    this.setData({
      switchCodeIndex: e.detail.value,
      [cgkey]: that.data.lightShowList[e.detail.value].switch_code,
      [cgvalue]: that.data.lightShowList[e.detail.value].switch_code_detail
    })
    console.log(that.data.switch_codes)
  } 
  
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
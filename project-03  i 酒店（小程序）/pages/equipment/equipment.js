// pages/equipment/equipment.js
//获取应用实例
var app = getApp();
var that = undefined;
const http = require('../../utils/http.js');
const prom = require('../../utils/prom.js');
const AudioContext = require('../../utils/AudioContext.js');

// 修改房态的键值对dict
const cg_status_base = {
  'OD': ['OC'], //住脏可修改状态
  'VC': ['VD', 'OO', 'OS'], //干净可修改状态
  'VD': ['VC', 'OO', 'OS'], //脏房可修改状态
  'OO': ['VD'], //修理可修改状态,,,
  'OC': ['OD'] //住净可修改状态
};

// 占用状态的键值对dict
const cg_occupy_base = {
  'OCZ': ['NNZ'], //入住占用可修改状态
  'OOZ': ['NNZ'], //维修占用可修改状态
  'OSZ': ['NNZ'], //锁房占用可修改状态
  'YDZ': ['NNZ'], //预定占用可修改状态
  'NNZ': ['OCZ', 'OOZ', 'OSZ', 'YDZ'], //未占用可修改的占用状态
};

Page({
  data: {
    eq_or_status: false, // 判断是否为房态还是设备态
    /***************************************房态图*************************************************************/
    tabbar: {},
    userInfo: {},
    state_data: {},
    // 设置
    roomList: [],
    // 筛选条件 房态图筛选

    // 房态更改
    cg_visiable: true,

    // 筛选数组
    chooseList: [{
      name: '状态筛选',
      codeList: []
    },
    {
      name: '房型筛选',
      codeList: []
    },
    {
      name: '楼层筛选',
      codeList: []
    },
    {
      name: '楼栋筛选',
      codeList: []
    },
    ],

    // 房务人员picker选择
    array: ['admin', '兮妹儿', '王阿姨', '赵叔叔'],
    chooseIndex: 0, //对应的函数：bindPickerchange;
    reasonArray: ['路线整修', '装修', '安装智能设备', '门锁整修'],
    reasonIndex: 0,
    modal_flag: true, //蒙层
    modal_flag_02: true,
    room_check_arr: [], //选中房间的数组
    // 维修原因选择
    reason_begin_date: '',
    start_time: '',
    // 锁房
    modal_lock: false,
    /*******************************设备态数据*****************************************************************/
    eqstatusList: [], //设备态列表
    eqCheckList: [{
      name: '状态筛选',
      list: []
    },
    {
      name: '房型筛选',
      list: []
    },
    {
      name: '楼层筛选',
      list: []
    }
    ], //筛选条件
    eq_color_base: {
      'cleaning': '#245196',
      'not bother': '#7d2e2a',
      "maintaining": '#f8b37d',
      'dirty': '#eeeeee',
      "inuse people in": '#99608c',
      "inuse not in": '#306a38'
    },

    // 选中某个筛选条件
    eq_check_form: {
      floor: '',
      status: '',
      type: ''
    },

    formIdArray: [] //formId

  },

  //事件处理函数
  onLoad: function (options) {
    that = this;
    var date = new Date();
    var Y = date.getFullYear();
    //月
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    that.setData({
      reason_begin_date: Y + '-' + M + '-' + D,
      reason_end_date: Y + '-' + M + '-' + D,
      start_time: Y + '-' + M + '-' + D
    })

    if (app.globalData.codeInfo.new_authorization) {

    } else {
      wx.navigateTo({
        url: '/pages/logins/logins',
      })
    }

  },
  onShow: function (options) {
    wx.showLoading({
      title: '',
      mask: true
    })

    // 设备态请求接口
    that.get_eq_check();
    that.get_eq();

  },
  /********************************************设备图函数****************************************************************/

  /* 设备态的请求接口 */
  get_eq_check() {
    // 设备态图筛选条件查询
    http.getReq(app.globalData.url_online.url_eq + 'equipment/ht/room/get_room_status_parameter/?hotel_id=' + app.globalData.userInfo.hotel_id, function (res) {
      console.log('设备态图筛选条件', res.data);

      // 房态Dict
      var eq_status_dict = {},
        roomCheckList = [];
      for (let j in res.data.room_status) {
        let call = res.data.room_status[j].call;
        eq_status_dict[call] = res.data.room_status[j].describe;
        roomCheckList.push(res.data.room_status[j].describe);
      }
      that.setData({
        eq_status_dict: eq_status_dict,
        ['eqCheckList[' + 0 + '].list']: roomCheckList,
        ['eqCheckList[' + 1 + '].list']: res.data.room_type_name,
        ['eqCheckList[' + 2 + '].list']: res.data.floor
      })
      // console.log(that.data.eqCheckList);
    });
  },

  // 设备态图查询
  get_eq() {
    AudioContext.AudioContext('刷新设备态中');
    http.postReq(app.globalData.url_online.url_eq + 'equipment/ht/room/get_room_status/', {
      'hid': app.globalData.userInfo.hotel_id
    }, function (res) {
      wx.showToast({
        title: '刷新成功',
        icon: 'none'
      })
      console.log('设备态图', res.data);
      that.setData({
        eqstatusList: res.data
      })
    });
  },

  // 更改筛选条件
  change_eq_check() {

    http.postReq(app.globalData.url_online.url_eq + 'equipment/ht/room/get_room_status/?floor=' + that.data.eq_check_form.floor + '&room_type_name=' + that.data.eq_check_form.type + '&room_status=' + that.data.eq_check_form.status, {
      'hid': app.globalData.userInfo.hotel_id
    }, function (res) {
      console.log('包含筛选条件的设备态图', res.data);
      wx.showToast({
        title: '刷新成功',
        icon: 'none'
      })
      that.setData({
        eqstatusList: res.data
      })
    });

  },
  // 设备态筛选
  bindEqPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value, e.currentTarget.dataset.listindex);
    let listIndex = e.currentTarget.dataset.listindex,
      value = parseInt(e.detail.value);
    if (listIndex == 0) {
      let cg_eq_status = '';
      for (let i in that.data.eq_status_dict) {
        if (that.data.eqCheckList[listIndex].list[value] == that.data.eq_status_dict[i]) {
          cg_eq_status = i
        }
      }
      that.setData({
        ['eq_check_form.status']: cg_eq_status
      })
    } else if (listIndex == 1) {
      that.setData({
        ['eq_check_form.type']: that.data.eqCheckList[listIndex].list[value]
      })
    } else if (listIndex == 2) {
      that.setData({
        ['eq_check_form.floor']: that.data.eqCheckList[listIndex].list[value]
      })
    }
    that.change_eq_check();
  },
  // 设备态与房态更改
  change_eq_or_status() {
    that.setData({
      eq_or_status: !that.data.eq_or_status
    })

    // 更改抬头title
    if (!that.data.eq_or_status) {
      wx.setNavigationBarTitle({
        title: '房态'
      })
    } else {
      wx.setNavigationBarTitle({
        title: '设备态'
      })
    }
  },



  /**********************************************公共函数************************************************************************/
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '',
      mask: true
    })
    this.onShow();
    wx.stopPullDownRefresh();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {

  },
  // 禁止触摸滑动
  preventTouchMove: function () {

  },

  navigateto(e) {
    let link = e.currentTarget.dataset.link;
    wx.navigateTo({
      url: link,
    })
  },
})
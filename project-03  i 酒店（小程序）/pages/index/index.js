//index.js
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
    check_index: -1,
    check_modal: false,

    check_list: [{
      name: '状态筛选',
      checked: true,
      list: []
    },
    {
      name: '房型筛选',
      checked: false,
      list: []
    },
    {
      name: '楼栋筛选',
      checked: false,
      list: []
    },
    {
      name: '楼层筛选',
      checked: false,
      list: []
    }
    ],
    // 房态更改
    cg_visiable: true,
    // 房态更改数组
    cg_list: [{
      name: '净房',
      code: 'VC',
      occupy: 'NNZ',
      check_flag: true
    },
    {
      name: '脏房',
      code: 'VD',
      occupy: 'NNZ',
      check_flag: true
    },
    {
      name: '锁房',
      code: 'OS',
      occupy: 'OSZ',
      check_flag: true
    },
    /*
    {
      name: '取消锁房',
      occupy: 'NNZ',
      check_flag: true
    },
     */
    {
      name: '维修',
      code: 'OO',
      occupy: 'OOZ',
      check_flag: true
    }
      /*
      {
        name: '取消维修',
        code: 'VD',
        occupy: 'NNZ',
        check_flag: true
      }
       */
    ],
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

  /**********************************房态图的函数******************************************************/
  get_room_status() {
    wx.showLoading({
      title: '',
      mask: true
    })
    // 状态筛选
    http.getReq(app.globalData.url_online.url_9101 + 'room_status/get_code_room_state_list/', function (res) {
      // console.log('状态筛选');
      // console.log(res.data);
      for (let i in that.data.check_list) {
        if (that.data.check_list[i].name === '状态筛选') {
          that.setData({
            ['check_list[' + i + '].list']: res.data.results
          })
        }
      }
      that.setData({
        state_data: res.data.results
      })
      // 获取的当前房态信息
      that.get_room_map_list();
    });
  },
  get_room_map_list() {
    AudioContext.AudioContext('刷新房态中');
    // 获取的当前房态信息
    http.getReq(app.globalData.url_online.url_9101 + 'room_status/get_room_map_list/?page_size=300', function (res) {
      console.log('房态', res.data);
      let results = that.room_change_color(res.data.results);
      that.setData({
        roomList: results
      })
      wx.hideLoading();
    });
  },
  // 选择房务人员
  bindPickerChange(e) {
    if (e.currentTarget.dataset.flag == '0') {
      this.setData({
        chooseIndex: e.detail.value
      })
    } else if (e.currentTarget.dataset.flag == '1') {
      this.setData({
        reasonIndex: e.detail.value
      })
    }
  },
  //维修原因日期选择
  bindDateChange(e) {
    this.setData({
      reason_begin_date: e.detail.value
    })
  },
  //维修原因日期选择
  bindDateChange01(e) {
    this.setData({
      reason_end_date: e.detail.value
    })
  },
  // textarea失去焦点
  bindTextAreaBlur(e) {
    that.setData({
      remark: e.detail.value
    })
  },
  // 选中房间号
  checkboxChange(e) {
    let value = e.detail.value;

    that.setData({
      cg_list: [{
        name: '净房',
        code: 'VC',
        occupy: 'NNZ',
        check_flag: true
      },
      {
        name: '脏房',
        code: 'VD',
        occupy: 'NNZ',
        check_flag: true
      },
      {
        name: '锁房',
        code: 'OS',
        occupy: 'OSZ',
        check_flag: true
      },
      /*
      {
        name: '取消锁房',
        occupy: 'NNZ',
        check_flag: true
      },
       */
      {
        name: '维修',
        code: 'OO',
        occupy: 'OOZ',
        check_flag: true
      }
        /*
        {
          name: '取消维修',
          code: 'VD',
          occupy: 'NNZ',
          check_flag: true
        }
         */
      ]
    })

    // 前端生成数组
    for (let i in value) {
      value[i] = {
        room_num: value[i].split(',')[0],
        room_state: value[i].split(',')[1],
        room_occupy: value[i].split(',')[2]
      };
      value[i].room_cg_state = cg_status_base[value[i].room_state];
      value[i].room_cg_occupy = cg_occupy_base[value[i].room_occupy];

      // 确认按钮是否显示功能按钮部分
      switch (value[i].room_state) {
        case 'VD':
          value[i].btn_group = [true, false, true, true];
          break; //脏房
        case 'VC':
          value[i].btn_group = [false, true, true, true];
          break; //净房
        case 'OC':
          value[i].btn_group = [false, true, false, false];
          break; //住净
        case 'OD':
          value[i].btn_group = [true, false, false, false];
          break; //住脏
        case 'OO':
          value[i].btn_group = [false, false, false, true];
          break; //维修
        default:
          value[i].btn_group = [true, true, true, true];
          break; //默认
      }

    }

    // 循环判断按钮是否显示
    for (let i in value) {
      // for (let j in value[i].btn_group) {
      if (value[i].btn_group[0] == false) {

        that.data.cg_list[0].check_flag = false;
      }

      if (value[i].btn_group[1] == false) {

        that.data.cg_list[1].check_flag = false;
      }

      if (value[i].btn_group[2] == false) {
        that.data.cg_list[2].check_flag = false;
      }

      if (value[i].btn_group[3] == false) {

        that.data.cg_list[3].check_flag = false;

      }

      // } 
      // if (value.length > 1) {
      // 判断是否能够维修
      if (value[i].room_occupy != 'OOZ') {


      } else {
        that.data.cg_list[3] = {
          name: '取消维修',
          code: 'VD',
          occupy: 'NNZ',
          check_flag: true
        }
      }
      // 判断是否能够锁房
      if (value[i].room_occupy == 'OSZ') {
        that.data.cg_list[2] = {
          name: '取消锁房',
          occupy: 'NNZ',
          check_flag: true
        }
      }
      // } else {
      //   // 判断是否能够维修
      //   if (value[i].room_occupy == 'OOZ') {
      //     that.data.cg_list[3] = {
      //       name: '取消维修',
      //       code: 'VD',
      //       occupy: 'NNZ',
      //       check_flag: true
      //     }
      //   }
      //   // 判断是否能够锁房
      //   if (value[i].room_occupy == 'OSZ') {
      //     that.data.cg_list[2] = {
      //       name: '取消锁房',
      //       occupy: 'NNZ',
      //       check_flag: true
      //     }
      //   }
      // }

    }

    that.setData({
      room_check_arr: value,
      cg_list: that.data.cg_list
    })
  },
  // 房态状态更改
  click_change(e) {
    var index = e.currentTarget.dataset.index,
      name = e.currentTarget.dataset.name;
    var date = new Date(),
      start_time = that.data.start_time + 'T' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    let room_check_arr = that.data.room_check_arr;
    if (room_check_arr.length) {
      if (name == '锁房') {
        that.setData({
          modal_flag_02: false,
          modal_lock: true,
          lock_index: index
        })

      } else if (name == '维修') {
        that.setData({
          modal_flag_02: false,
          lock_index: index
        })

      }
      /* else if (name == '净房') {
        wx.showToast({
          title: '不可直接修改为净房 ， 请去WEB端修改',
          icon: 'none'
        })

      } */
      else {

        for (let i in room_check_arr) {
          that.change_room_status(room_check_arr[i].room_num, start_time, start_time, room_check_arr[i].room_state, that.data.cg_list[index].code, '', room_check_arr[i].room_occupy, that.data.cg_list[index].occupy, '');
          if (i == (room_check_arr.length - 1)) {
            wx.showLoading({
              title: '',
              mask: true
            })
            setTimeout(function () {
              that.get_room_map_list();
            }, 1000)

          }
        }
      }
    } else {
      wx.showToast({
        title: '必须选中一个房间',
        icon: 'none'
      })
    }

  },
  /* 维修弹窗确认 */
  confirm_repair() {
    var date = new Date();
    let room_check_arr = that.data.room_check_arr,
      begin_time = that.data.reason_begin_date + 'T' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
      end_time = that.data.reason_end_date + 'T' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    console.log('维修', that.data.room_check_arr);
    if (room_check_arr.length) {
      for (let i in room_check_arr) {
        that.change_room_status(room_check_arr[i].room_num, begin_time, end_time, room_check_arr[i].room_state, 'OO', that.data.reasonArray[that.data.reasonIndex].code, room_check_arr[i].room_occupy, that.data.cg_list[that.data.lock_index].occupy, that.data.reasonArray[that.data.reasonIndex].descript);
        if (i == (room_check_arr.length - 1)) {
          wx.showLoading({
            title: '',
            mask: true
          })
          setTimeout(function () {
            // 获取的当前房态信息
            http.getReq(app.globalData.url_online.url_9101 + 'room_status/get_room_map_list/?page_size=300', function (res) {
              let results = that.room_change_color(res.data.results);
              that.setData({
                roomList: results,
                modal_flag_02: true
              })
              wx.hideLoading();
            });
          }, 1200);
        }
      }
    } else {
      wx.showToast({
        title: '必须选中一个房间',
        icon: 'none'
      })
    }
  },
  /* 锁房原因弹窗确认函数 */
  confirm_lock() {
    var date = new Date();
    let room_check_arr = that.data.room_check_arr,
      begin_time = that.data.reason_begin_date + 'T' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
      end_time = that.data.reason_end_date + 'T' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    console.log('锁房');
    if (room_check_arr.length) {
      for (let i in room_check_arr) {
        that.change_room_status(room_check_arr[i].room_num, begin_time, end_time, room_check_arr[i].room_state, room_check_arr[i].room_state, '锁房', room_check_arr[i].room_occupy, that.data.cg_list[that.data.lock_index].occupy, '锁房');
        if (i == (room_check_arr.length - 1)) {
          wx.showLoading({
            title: '',
            mask: true
          })
          setTimeout(function () {
            // 获取的当前房态信息
            http.getReq(app.globalData.url_online.url_9101 + 'room_status/get_room_map_list/?page_size=300', function (res) {
              let results = that.room_change_color(res.data.results);
              that.setData({
                roomList: results,
                modal_flag_02: true
              })

              wx.hideLoading();
            });
          }, 1200)
        }
      }
    } else {
      wx.showToast({
        title: '必须选中一个房间',
        icon: 'none'
      })
    }
  },
  // 更改房态
  change_room_status(room_no, start_time, end_time, room_state_before_code, room_state_after_code, room_state_change_reason, room_occupy_before_code, room_occupy_after_code, room_occupy_change_reason) {

    let post_data = {
      "room_no_id": 0,
      "room_no": room_no, //** 房间号 **/
      "start_time": start_time, //** 时间起始 **/
      "end_time": end_time, //** 时间终止 **/
      "room_state_before_code": room_state_before_code, //** 更改之前的房态 **/
      "room_state_after_code": room_state_after_code, //** 更改之后的房态 **/
      "room_state_change_reason": room_state_change_reason, //** 房态更改原因 **/
      "room_occupy_before_code": room_occupy_before_code, //**  **/
      "room_occupy_after_code": room_occupy_after_code, //** **/
      "room_occupy_change_reason": room_occupy_change_reason, //** **/
      "done_id": null,
      "done_time": null,
      "remark": "",
      "rsv_id": null,
      "master_id": null,
      "account": "",
      "adult_num": null,
      "children_num": null,
      "room_type_nos": "",
      "room_nums": null,
      "arranged": null,
      "room_decorated_id": "",
      "code_src": "",
      "code_market": "",
      "special": ""
    };
    // 更改房态信息
    http.postReq(app.globalData.url_online.url_9101 + 'room_status/manual_change_room_status/', post_data, function (res) {
      wx.showToast({
        title: '修改成功',
        icon: 'none'
      })
      that.update_status();
    });
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
  // 显示房务人员操作弹窗
  show_person_modal(e) {
    that.setData({
      modal_flag: !that.data.modal_flag
    })
  },
  // 显示维修原因操作弹窗
  show_reason_modal(e) {
    that.setData({
      modal_flag_02: !that.data.modal_flag_02
    })
  },
  cancle_modal_flag() {
    that.setData({
      modal_flag: true,
      modal_flag_02: true
    })
  },
  // 点击修改房态
  change_room(e) {
    that.setData({
      cg_visiable: false
    })
    // that.show_person_modal();
    AudioContext.AudioContext('修改房态');
  },
  // 更新状态
  update_status(e) {
    that.setData({
      cg_visiable: true,
      cg_list: [{
        name: '净房',
        code: 'VC',
        occupy: 'NNZ',
        check_flag: true
      },
      {
        name: '脏房',
        code: 'VD',
        occupy: 'NNZ',
        check_flag: true
      },
      {
        name: '锁房',
        code: 'OS',
        occupy: 'OSZ',
        check_flag: true
      },
      /*
      {
        name: '取消锁房',
        occupy: 'NNZ',
        check_flag: true
      },
       */
      {
        name: '维修',
        code: 'OO',
        occupy: 'OOZ',
        check_flag: true
      }
        /*
        {
          name: '取消维修',
          code: 'VD',
          occupy: 'NNZ',
          check_flag: true
        }
         */
      ],
    })
  },

  //点击选中放入筛选数组
  choose_check(e) {
    var chooseList = that.data.chooseList,
      code = e.currentTarget.dataset.code,
      name = e.currentTarget.dataset.name,
      index = e.currentTarget.dataset.index;
    // 根绝选中的放入传给后台的暂存数组
    for (let i in chooseList) {
      if (name == chooseList[i].name) {
        if (chooseList[i].codeList.length) {
          let indexOfnum = chooseList[i].codeList.indexOf(code);
          if (indexOfnum === -1) {
            chooseList[i].codeList.push(code);
          } else {
            chooseList[i].codeList.splice(indexOfnum, 1);
          }
        } else {
          chooseList[i].codeList.push(code);
        }
      }
    }
    // 判断更改状态
    if (that.data.check_list[that.data.check_index].list[index].hoverClass == 0 || that.data.check_list[that.data.check_index].list[index].hoverClass == undefined) {
      that.data.check_list[that.data.check_index].list[index].hoverClass = 1;
    } else {
      that.data.check_list[that.data.check_index].list[index].hoverClass = 0;
    }
    that.setData({
      chooseList: chooseList,
      check_list: that.data.check_list
    })
  },
  // 重置按钮
  reset(e) {
    that.setData({
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
      check_index: -1
    })
    // 获取的当前房态信息
    that.get_room_map_list();

    wx.showToast({
      title: '重置成功',
      icon: 'none'
    })
  },
  confirm() {
    //room_state__in 状态字段
    //building_name__in 楼栋字段
    //floor_number__in 楼层字段
    //room_type_name__in 房型字段
    var chooseList = that.data.chooseList,
      room_state__in,
      building_name__in,
      floor_number__in,
      room_type_name__in;

    for (let i in chooseList) {
      if (chooseList[i].name === '状态筛选') {
        if (chooseList[i].codeList.length) {
          room_state__in = '&room_state__in=' + chooseList[i].codeList.join(',');
        } else {
          room_state__in = '';
        }

      } else if (chooseList[i].name === '房型筛选') {
        if (chooseList[i].codeList.length) {
          room_type_name__in = '&room_type_name__in=' + chooseList[i].codeList.join(',');
        } else {
          room_type_name__in = '';
        }
      } else if (chooseList[i].name === '楼层筛选') {

        if (chooseList[i].codeList.length) {
          floor_number__in = '&floor_number__in=' + chooseList[i].codeList.join(',');
        } else {
          floor_number__in = '';
        }

      } else if (chooseList[i].name === '楼栋筛选') {
        if (chooseList[i].codeList.length) {
          building_name__in = '&building_name__in=' + chooseList[i].codeList.join(',');
        } else {
          building_name__in = '';
        }
      }
    }
    var http_url = app.globalData.url_online.url_9101 + 'room_status/get_room_map_list/?page_size=300' + room_state__in + building_name__in + floor_number__in + room_type_name__in;
    // 筛选当前房态信息
    http.getReq(http_url, function (res) {
      let results = that.room_change_color(res.data.results);
      console.log('筛选后房态', results);
      that.setData({
        roomList: results
      })

      that.setData({
        check_index: -1
      })
    });
  },
  // 跳转
  navigate: function (e) {
    let link = e.currentTarget.dataset.link,
      status = e.currentTarget.dataset.status;
    if (that.data.cg_visiable) {
      switch (status) {

        case 'VC':   // 净房
        case 'VD':   // 脏房
          wx.navigateTo({
            url: "/pages/index/order/order?room_no=" + e.currentTarget.dataset.roomno + '&room_type=' + e.currentTarget.dataset.room_type + '&room_type_code=' + e.currentTarget.dataset.room_type_code + '&room_building=' + e.currentTarget.dataset.room_building + '&room_floor=' + e.currentTarget.dataset.room_floor + '&max_can_live_num=' + e.currentTarget.dataset.max_can_live_num//判断是否为预定房还是入住房：0：预订房；1：入住房
          })
          break;

        // 维修房
        case 'OO':
          wx.showToast({
            title: '该房间正在维修中',
            icon: 'none'
          })
          break;

        // 住净房||住脏房.
        case 'OC':
          case 'OD':

           /**
            * 在住单有问题 ,现在这两个房态也跳转到预定页面
            * */
          wx.navigateTo({
            url: link 
          })

          /* wx.navigateTo({
            url: "/pages/index/order/order?room_no=" + e.currentTarget.dataset.roomno + '&room_type=' + e.currentTarget.dataset.room_type + '&room_type_code=' + e.currentTarget.dataset.room_type_code + '&room_building=' + e.currentTarget.dataset.room_building + '&room_floor=' + e.currentTarget.dataset.room_floor+ '&max_can_live_num=' + e.currentTarget.dataset.max_can_live_num
          }) */
          break;
         
      }
    } else {
      wx.showToast({
        title: '当前正在操作房态',
        icon: 'none'
      })
    }
  },
  /* 无操作权限弹窗 */
  showtoast() {
    wx.showToast({
      title: '当前用户没有权限',
      icon: 'none'
    })
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


    // 楼栋筛选
    http.getReq(app.globalData.url_online.url_9101 + 'room_status/get_room_building_list/', function (res) {
      console.log('楼栋筛选', res.data);
      for (let i in that.data.check_list) {
        if (that.data.check_list[i].name === '楼栋筛选') {
          that.setData({
            ['check_list[' + i + '].list']: res.data.results
          })
        }
      }
    });

    // 楼层筛选
    http.getReq(app.globalData.url_online.url_9101 + 'room_status/get_room_floor_list/', function (res) {
      console.log('楼层筛选', res.data);

      for (let i in that.data.check_list) {
        if (that.data.check_list[i].name === '楼层筛选') {
          that.setData({
            ['check_list[' + i + '].list']: res.data.results
          })
        }
      }
    });

    // 房型筛选
    http.getReq(app.globalData.url_online.url_9101 + 'room_status/get_room_type_list/', function (res) {
      console.log('房型筛选', res.data.results);
      // 将房型codebase放入全局
      app.globalData.roomType = res.data.results;

      for (let i in that.data.check_list) {
        if (that.data.check_list[i].name === '房型筛选') {
          that.setData({
            ['check_list[' + i + '].list']: res.data.results
          })
        }
      }
    });
    // that.change_room_status();

    // 获取维修原因数据
    http.getReq(app.globalData.url_online.url_9103 + 'system/settings/get_code_base_list/?parent_code=room_maint_reason', function (res) {
      console.log('维修原因', res.data);
      that.setData({
        reasonArray: res.data.results
      })
    });
  },
  //  更改房态钱颜色的函数
  room_change_color(results) {
    // 声明颜色的键值对
    var color_base = {};
    for (let j in that.data.state_data) {
      let code = that.data.state_data[j].code;
      color_base[code] = that.data.state_data[j].color
    }

    // 循环赋值
    for (let i in results) {
      results[i].color = color_base[results[i].room_state];
    }


    that.setData({
      color_base: color_base
    })
    return results;
  },


  onShow: function (options) {
    wx.showLoading({
      title: '',
      mask: true
    })


    // 状态筛选
    http.getReq(app.globalData.url_online.url_9101 + 'room_status/get_code_room_state_list/', function (res) {
      console.log('状态筛选', res.data);
      for (let i in that.data.check_list) {
        if (that.data.check_list[i].name === '状态筛选') {
          that.setData({
            ['check_list[' + i + '].list']: res.data.results
          })
        }
      }
      that.setData({
        state_data: res.data.results
      })
      // 获取的当前房态信息
      that.get_room_map_list()
    });

    // 占用code
    /* http.getReq(app.globalData.url_online.url_9101 + 'room_status/get_code_room_occupy_list/', function(res) {
      console.log('占用code',res.data);

    }); */

    // 设备态请求接口
    /* that.get_eq_check();
    that.get_eq(); */

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
  change_eq_or_status_01() {
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
  change_eq_or_status() {
    wx.navigateTo({
      url: '/pages/detail/detail',
    })
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


  /* formId: 拼接传给后台 */
  sendmes(e) {
    var that = this,
      formId = e.detail.formId,
      formIdArray = [];
    that.get_room_status();
    that.get_eq();

    if (formId != 'the formId is a mock one' && formId) {
      formIdArray.push(formId);
      that.setData({
        formIdArray: formIdArray
      })

      /* 传送formId */
      wx.request({
        url: app.globalData.url_online.url_9103 + 'system/wechat/cache_open_id_form_id/',
        data: {
          "form_id_list": JSON.stringify(that.data.formIdArray)
        },
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'authorization': app.globalData.codeInfo.new_authorization
        }, //请求头,也可以没有
        success: function (res) {
          console.log(res.data, "push msg");
        },
        fail: function (err) {
          console.log(err, "push err");
        }
      })
    }

  },
  /**
   * @order 预定
   */
  order() {
    let params = {
      "rsv_type": that.data.rsv_type,   // 预定类型
      "arr_time": that.data.on_date + ' 12:00:00',    // 到达时间
      "days": that.data.days,           // 住宿天数
      "leave_time": that.data.off_date + ' 12:00:00', // 离开时间
      "code_market": "SK",            // 市场码
      "code_src": "SMSK",             // 来源码
      "rate_code": "BAR",              // 房价码 
      "rsv_person_name": that.data.orderJson.name,        // 预定人姓名 
      "mobile_master": that.data.orderJson.phone,          // 预定人电话  
      "remark": that.data.orderJson.remark,                // 备注
      "rt_rate": [
        {
          "room_type": that.data.room_type,
          "room_count": 1,
          "rate_code_price": '',
          "room_number_list": [that.data.room_number],
        }
      ]
    },
      url = app.globalData.url_online.url_9102 + 'bill/add_reserve_base/';

    http.postReq(url, params, function (res) {
      console.log(res);
      if (res.message == 'success') {
        wx.showToast({
          title: '预定成功,订单号为' + res.data.order_no,
          icon: 'none'
        })
        var order_no = res.data.order_no;

        //发送消息
        that.send_msg({
          phone_number: that.data.orderJson.phone,
          sign_name: "皇冠晶品酒店服务中心",
          template_code: "SMS_173405844",
          template_param: {
            status: "成功",
            order: order_no.slice(0, 4) + '****' + order_no.slice(-5, -1),
            name: that.data.orderJson.name,
            date: that.data.on_date,
            hotel: "科冠晶品酒店",
            roomtype: that.data.room_type,
            much: "1",
            day: day,
            money: room_price,
            adress: "上海市浦东新区人民东路2635弄105号",
            tel: '4001600703'
          }
        });
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000)

      } else {
        wx.showToast({
          title: '预定失败',
          icon: 'none'
        })
      }
    });
  },
})
// pages/opeindex/opecateye/cateye.js
var app = getApp();
var that = undefined;
const http = require('../../../utils/http.js');
const array2String = function (buffer) {
  let hexArr = Array.prototype.map.call(
    new Uint8Array(buffer),
    function (bit) {
      return ('00' + bit.toString(16)).slice(-2)
    }
  )
  return `${hexArr[7]}:${hexArr[6]}:${hexArr[5]}:${hexArr[2]}:${hexArr[1]}:${hexArr[0]}`
}
/**
 * 搜索设备界面
 */
Page({
  data: {
    logs: [],
    loading: false,
    list: [],
    modal: true,
    form: { name: '' }

  },
  bindinput(e) {
    that.setData({
      ['form.name']: e.detail.value
    })
    console.log(that.data.form)
  },
  onLoad: function () {
    console.log('onLoad')
    that = this;
    wx.showLoading();
    wx.openBluetoothAdapter({
      success: function (res) {
        // success
        console.log("-----success----------");
        console.log(res);
        wx.startBluetoothDevicesDiscovery({
          services: [],
          success: function (res) {
            wx.hideLoading();
            // success
            console.log("-----startBluetoothDevicesDiscovery--success----------");
            console.log(res);
            wx.getBluetoothDevices({
              success: function (res) {
                // success
                //{devices: Array[11], errMsg: "getBluetoothDevices:ok"}
                console.log("getBluetoothDevices");
                console.log(res);
                that.setData({
                  list: res.devices
                });
                console.log("获取到蓝牙列表", that.data.list);

              },
              fail: function (res) {
                // fail
                wx.hideLoading();
              },
              complete: function (res) {
                // complete
              }
            })


          },
          fail: function (res) {
            // fail
            console.log(res);
            wx.hideLoading();
          },
          complete: function (res) {
            // complete
            console.log(res);
          }
        })

      },
      fail: function (res) {
        console.log("-----fail----------");
        wx.hideLoading();
        // fail
        wx.showToast({
          title: '请确保打开蓝牙',
          icon: 'none',
          duration: 5000
        })
      },
      complete: function (res) {
        // complete
        console.log("-----complete----------");
        console.log(res);
      }
    })
  },
  onShow: function () {
    console.log('onShow')

  },
  //向蓝牙设备发送一个0x00的16进制数据
  hexStringToArrayBuffer(str) {
    if (!str) {
      return new ArrayBuffer(0);
    }
    var buffer = new ArrayBuffer(str.length);
    let dataView = new DataView(buffer)
    let ind = 0;
    for (var i = 0, len = str.length; i < len; i += 2) {
      let code = parseInt(str.substr(i, 2), 16)
      dataView.setUint8(ind, code)
      ind++
    }
    return buffer;
  },
  showmodal() {
    that.setData({ modal: !that.data.modal })
  },
  bindCheck(e) {

    that.setData({
      modal: false,
      deviceId: e.currentTarget.dataset.deviceid,
      deviceName: e.currentTarget.dataset.name,
      ['form.name']: e.currentTarget.dataset.name
    })
  },
  //点击事件处理

  /** 
   * @bindViewTap 点击获取蓝牙
   *  此段代码仅为实现该项目，仅供参考，后期重写
    （时间紧张，先凑合着用）
  */
  bindViewTap: function (e) {

    var deviceId = that.data.deviceId;
    var name = that.data.deviceName;
    /**
      * 监听设备的连接状态
      */
    wx.onBLEConnectionStateChanged(function (res) {
      console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
    })
    wx.showLoading();
    wx.openBluetoothAdapter({
      success(res) {
        console.log(res);
        /**
        * 连接设备
        */
        wx.createBLEConnection({
          deviceId: deviceId,
          success: function (res) {
            // success
            console.log(res);
            /**
             * 连接成功，后开始获取设备的服务列表
             */
            wx.getBLEDeviceServices({
              // 这里的 deviceId 需要在上面的 getBluetoothDevices中获取
              deviceId: deviceId,
              success: function (res) {
                console.log('UUID——device services:', res.services)
                /* that.setData({
                  list: res.services,
                  loading: true
                }); */
                for (let i in res.services) {
                  let serviceId = res.services[i].uuid;
                  console.log(serviceId)
                  wx.getBLEDeviceCharacteristics({
                    deviceId: deviceId,
                    serviceId: serviceId, // UUID
                    success: function (res) {

                      console.log('getBLEDeviceCharacteristics success', res);

                      for (let i = 0; i < res.characteristics.length; i++) {
                        let item = res.characteristics[i];
                        if (item.properties.read) {
                          wx.readBLECharacteristicValue({ //读取低功耗蓝牙设备的特征值的二进制数据值
                            deviceId,
                            serviceId,
                            characteristicId: item.uuid,
                            success(res) {
                              console.log('readBLECharacteristicValue:', res.errCode)
                            }
                          })
                        }
                        let characteristicId = item.uuid;
                        if (item.properties.write) {//向低功耗蓝牙设备特征值中写入二进制数据。注意：必须设备的特征值支持 write 才可以成功调用
                          wx.writeBLECharacteristicValue({
                            // 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
                            deviceId,
                            // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
                            serviceId,
                            // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
                            characteristicId,
                            // 这里的value是ArrayBuffer类型
                            value: that.hexStringToArrayBuffer('FFA510A1030801020304050607080284'),
                            success(res) {
                              console.log('writeBLECharacteristicValue success', res.errMsg);
                              setTimeout(function () {
                                /* 
                                * 关闭蓝牙模块
                                */
                                wx.closeBluetoothAdapter({
                                  success(res) {
                                    console.log(res);
                                    wx.hideLoading();
                                  }
                                })
                              }, 800)
                              /**
                               * 回调获取 设备发过来的数据
                               */
                              wx.onBLECharacteristicValueChange(function (res) {
                                console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
                                console.log(that.ab2hex(res.value));
                                if (that.ab2hex(res.value) == "0000000000000000000000000000000000000000") {

                                }

                              })

                            },
                            fail(res) {
                              console.log('writeBLECharacteristicValue fail', res);
                              wx.hideLoading();
                              wx.showToast({
                                title: '写入失败，请尝试重新连接',
                                icon: 'none',
                                duration: 3000
                              })
                            }
                          })
                        }
                        /* if (item.properties.notify || item.properties.indicate) {
                          wx.notifyBLECharacteristicValueChange({//启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。注意：必须设备的特征值支持 notify 或者 indicate 才可以成功调用。
                            deviceId,
                            serviceId,
                            characteristicId: characteristicId,
                            state: true,
                            success(res) {
                              console.log('notifyBLECharacteristicValueChange:', res);
                              
                            }
                          })
                        } */
                      }


                    },
                    fail: function (res) {
                      // fail
                      console.log(res); wx.hideLoading();
                      wx.showToast({
                        title: '获取蓝牙特征值失败',
                        icon: 'none',
                        duration: 3000
                      })

                    },
                    complete: function (res) {
                      // complete
                      console.log(res);
                    }
                  })
                }
              }
            })
          },
          fail: function (res) {
            // fail
            console.log(res); wx.hideLoading();
            wx.showToast({
              title: '蓝牙可能正在占用',
              icon: 'none',
              duration: 3000
            })

          },
          complete: function (res) {
            // complete
            console.log(res);
          }
        })
      },
      fail: function (res) {
        // fail
        console.log(res);
        wx.hideLoading();
      },
      complete: function (res) {
        // complete
        console.log(res);
      }
    })

  },

  /**
   * @strToHexCharCode 字符串转为16进制
  */
  strToHexCharCode(str) {
    var val = "";
    for (var i = 0; i < str.length; i++) {
      if (val == "")
        val = str.charCodeAt(i).toString(16);
      else
        val += " " + str.charCodeAt(i).toString(16);
    }
    return val;
  },

  /**
   * @addFromIndex  从index下标添加空格
   * */
  addFromIndex(num, index) {
    let str = '';
    for (let i = 0; i < num.length; i++) {
      if (i % index == 0) {
        str += ' ' + num.slice(i, i + index)
      }
    }
    return str
  },
  nameFormate(name) {
    let ble_1 = 'FF A5',
      ble_3 = 'A1 01',
      ble_5 = that.strToHexCharCode(name).toUpperCase(),

      ble4 = ((ble_5.replace(/\s*/g, '').length / 2).toString(16)).toUpperCase(),
      ble_4 = ble4.padStart(2, '0'),
      ble2 = ((((ble_1 + ble_3 + ble_4 + ble_5).replace(/\s*/g, '').length / 2) + 3).toString(16)).toUpperCase(),
      ble_2 = ble2.padStart(2, '0'),
      ble_info = ble_1 + ' ' + ble_2 + ' ' + ble_3 + ' ' + ble_4 + ' ' + ble_5;

    let result = 0, array = ble_info.split(' ');

    for (let i = 0; i < array.length; i++) {
      result += parseInt(array[i], 16)
    }
    let result_tail = result.toString(16).padStart(4, '0');
    return ble_info.replace(/\s*/g, '') + result_tail
  },


  bindChangeName: function (cname) {
    var deviceId = that.data.deviceId;
    var name = that.data.deviceName;
    /**
      * 监听设备的连接状态
      */
    console.log('-----name-------------', that.data.form.name)
    wx.onBLEConnectionStateChanged(function (res) {
      console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
    })
    wx.showLoading();
    wx.openBluetoothAdapter({
      success(res) {
        console.log(res);
        /**
        * 连接设备
        */
        wx.createBLEConnection({
          deviceId: deviceId,
          success: function (res) {
            // success
            console.log(res);
            /**
             * 连接成功，后开始获取设备的服务列表
             */
            wx.getBLEDeviceServices({
              // 这里的 deviceId 需要在上面的 getBluetoothDevices中获取
              deviceId: deviceId,
              success: function (res) {
                console.log('UUID——device services:', res.services)
                /* that.setData({
                  list: res.services,
                  loading: true
                }); */
                for (let i in res.services) {
                  let serviceId = res.services[i].uuid;
                  console.log(serviceId)
                  wx.getBLEDeviceCharacteristics({
                    deviceId: deviceId,
                    serviceId: serviceId, // UUID
                    success: function (res) {

                      console.log('getBLEDeviceCharacteristics success', res);

                      for (let i = 0; i < res.characteristics.length; i++) {
                        let item = res.characteristics[i];
                        if (item.properties.read) {
                          wx.readBLECharacteristicValue({ //读取低功耗蓝牙设备的特征值的二进制数据值
                            deviceId,
                            serviceId,
                            characteristicId: item.uuid,
                            success(res) {
                              console.log('readBLECharacteristicValue:', res.errCode)
                            }
                          })
                        }
                        let characteristicId = item.uuid;

                        if (item.properties.write) {//向低功耗蓝牙设备特征值中写入二进制数据。注意：必须设备的特征值支持 write 才可以成功调用
                          wx.writeBLECharacteristicValue({
                            // 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
                            deviceId,
                            // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
                            serviceId,
                            // 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
                            characteristicId,
                            // 这里的value是ArrayBuffer类型
                            value: that.hexStringToArrayBuffer(that.nameFormate(that.data.form.name)),
                            success(res) {
                              console.log('writeBLECharacteristicValue success', res);
                              that.InitializeCateye(that.data.form.name, that.data.form.name, that.data.deviceId, '0102030405060708')
                              /* 
                              * 关闭蓝牙模块
                              */
                              wx.closeBluetoothAdapter({
                                success(res) {
                                  console.log(res);
                                  wx.hideLoading();
                                }
                              })
                              /**
                               * 回调获取 设备发过来的数据
                               */
                              wx.onBLECharacteristicValueChange(function (res) {
                                console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`);
                                console.log(res);
                                console.log(that.ab2hex(res.value));
                                if (that.ab2hex(res.value) == "0000000000000000000000000000000000000000") {
                                  setTimeout(function () {

                                  }, 800)
                                }

                              })

                            },
                            fail(res) {
                              console.log('writeBLECharacteristicValue fail', res);
                              wx.hideLoading();
                              wx.showToast({
                                title: '写入失败，请尝试重新连接',
                                icon: 'none',
                                duration: 3000
                              })
                            }
                          })
                        }
                        /* if (item.properties.notify || item.properties.indicate) {
                          wx.notifyBLECharacteristicValueChange({//启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。注意：必须设备的特征值支持 notify 或者 indicate 才可以成功调用。
                            deviceId,
                            serviceId,
                            characteristicId: item.uuid,
                            state: true,
                          })
                        } */
                      }
                    },
                    fail: function (res) {
                      // fail
                      console.log(res); wx.hideLoading();
                      wx.showToast({
                        title: '获取蓝牙特征值失败',
                        icon: 'none',
                        duration: 3000
                      })

                    },
                    complete: function (res) {
                      // complete
                      console.log(res);
                    }
                  })
                }
              }
            })
          },
          fail: function (res) {
            // fail
            console.log(res); wx.hideLoading();
            wx.showToast({
              title: '蓝牙可能正在占用',
              icon: 'none',
              duration: 3000
            })

          },
          complete: function (res) {
            // complete
            console.log(res);
          }
        })
      },
      fail: function (res) {
        // fail
        console.log(res);
        wx.hideLoading();
      },
      complete: function (res) {
        // complete
        console.log(res);
      }
    })

  },
  /* ArrayBuffer转16进制字符串示例 */
  ab2hex(buffer) {
    let hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
  },

  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {
    that.onLoad();

    wx.stopPullDownRefresh();
  },

  //获取蓝牙设备某个服务中所有特征值(characteristic)
  getBLEDeviceCharacteristics(deviceId, serviceId) {
    wx.getBLEDeviceCharacteristics({
      deviceId,
      serviceId,
      success: (res) => {
        console.log('getBLEDeviceCharacteristics success', res.characteristics)
        for (let i = 0; i < res.characteristics.length; i++) {
          let item = res.characteristics[i]
          //读取低功耗蓝牙设备的特征值的二进制数据值
          if (item.properties.read) {
            wx.readBLECharacteristicValue({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
            })
          }

          //向低功耗蓝牙设备特征值中写入二进制数据。注意：必须设备的特征值支持 write 才可以成功调用
          if (item.properties.write) {
            this.canWrite = true;
            this.deviceId = deviceId;
            this.serviceId = serviceId;
            this.characteristicId = item.uuid;
            this.writeBLECharacteristicValue();
          }

          //启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。注意：必须设备的特征值支持 notify 或者 indicate 才可以成功调用。
          if (item.properties.notify || item.properties.indicate) {
            wx.notifyBLECharacteristicValueChange({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
              state: true,
            })
          }

        }
      },
      fail(res) {
        console.error("‘getBLEDeviceCharacteristics’", res);
        // 获取特征属性失败
      }
    })
  },

  InitializeCateye(cateye_device_id, room_number, ble_mac, ble_password) {
    let params = {
      "cateye_device_id": cateye_device_id,// 猫眼设备id
      "room_number": room_number, // 房间号
      "ble_mac": ble_mac,// 蓝牙macid
      "ble_password": ble_password // 蓝牙密码
    };
    console.log('-------------->', params)
    /** 
     * http.postReq(app.globalData.url_online.url_eq + 'equipment/ht/cateye/xcx_add_cateye/', params, function (res) {
      console.log(res.data);
      wx.showToast({
        title: '修改成功',
        icon: 'none'
      })
    }); */

    /** *
     *  此处请求未用公共函数, 蓝牙请求的可能会是多次, 只要有一次成功就可以, 所以暂时不提供失败提示 
     * 
     * */
    wx.request({
      url: "app.globalData.url_online.url_eq + 'equipment/ht/cateye/xcx_add_cateye/'",
      header: {
        'content-type': 'application/json',
        'authorization': app.globalData.codeInfo.new_authorization
      },
      data: params,
      method: 'post',
      success: function (res) {
        if (res.data.new_authorization) {
          app.globalData.codeInfo.new_authorization = res.data.new_authorization;
          wx.setStorageSync('codeInfo', app.globalData.codeInfo);
        }
        if (res.data.message == 'success') {
          console.log(res.data.data);
          wx.showToast({
            title: '修改成功',
            icon: 'none'
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '修改失败,稍后重试',
          icon: 'none'
        })
      }
    })

  },

  onHide: function () {
    /* 
      * 关闭蓝牙
    */
    wx.closeBluetoothAdapter({
      success(res) {
        console.log(res)
      }
    })
  }
})
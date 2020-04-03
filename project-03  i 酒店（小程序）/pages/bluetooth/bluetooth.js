// pages/bluetooth/bluetooth.js
var app = getApp();
var that = undefined;
const http = require('../../utils/http.js');
/**
 * 搜索设备界面
 */
Page({
  data: {
    logs: [],
    loading: false,
    list: []
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
  //点击事件处理
  bindViewTap: function (e) {
    console.log(e.currentTarget.dataset.deviceid);
    console.log(e.currentTarget.dataset.name);
    console.log(e.currentTarget.dataset.advertisData);

    var deviceId = e.currentTarget.dataset.deviceid;
    var name = e.currentTarget.dataset.name;
    /**
      * 监听设备的连接状态
      */
    wx.onBLEConnectionStateChanged(function (res) {
      console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
    })
    wx.showLoading();
    wx.openBluetoothAdapter({
      success (res) {
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
                              /**
                               * 回调获取 设备发过来的数据
                               */
                              wx.onBLECharacteristicValueChange(function (res) {
                                console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`)
                                console.log(that.ab2hex(res.value));
                                if(that.ab2hex(res.value)=="0000000000000000000000000000000000000000"){
                                  setTimeout(function(){
                                    /* 
                                    * 关闭蓝牙模块
                                    */
                                    wx.closeBluetoothAdapter({
                                      success(res) {
                                        console.log(res);
                                        wx.hideLoading();
                                      }
                                    })
                                  },800)
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
                      console.log(res);wx.hideLoading();
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
            console.log(res);wx.hideLoading();
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
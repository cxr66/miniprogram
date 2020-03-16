var app = getApp();
//var socketOpen = false;
var socketMsgQueue = [];

function connectSocket(url) {
  wx.connectSocket({
    url: url,
    success: function () {
      wx.onSocketOpen(function (res) {
        //console.log("websocket已连接");
        app.globalData.socketOpen = true;
        //console.log("socketOpen" + app.globalData.socketOpen);
        for (var i = 0; i < socketMsgQueue.length; i++) {
          sendSocketMessage(socketMsgQueue[i]);
        }
        socketMsgQueue = [];
      });
    }
  });
}

function socketClose(n) {

  wx.onSocketClose(function (res) {
    data: app.globalData.userInfo.unionId;
    //console.log('socket close');
    wx.onSocketOpen(function () {
      //socketOpen = false;
      wx.closeSocket();
    });
    console.log('WebSocket 已关闭！');
  });
}

wx.onSocketClose(function (res) {
  app.globalData.socketOpen =  false;
  console.log('app.globalData.socketOpen====' + app.globalData.socketOpen);
  wx.onSocketOpen(function () {
    wx.closeSocket();
  });
  console.log('WebSocket 已关闭！');
});


function sendSocketMessage(msg) {
  if (app.globalData.socketOpen==true) {
    wx.sendSocketMessage({
      data: msg
    });
  } else {
    socketMsgQueue.push(msg);
  }
};
module.exports = {
  connectSocket: connectSocket,
  sendSocketMessage: sendSocketMessage,
  socketClose: socketClose
}


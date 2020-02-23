/*
  * A JavaScript For AudioContext And WechatSI , voice play
  * 注意事项:该函数需要小程序：”微信同声传译“ 插件支持，在微信公众平台-设置-第三方服务中添加此插件 
    (Note: this function requires small program: "WeChat simultaneous interpretation" plug-in support, add this plug-in in WeChat public platform-setting-third party service)

  * 使用注意事项: 在小程序app.json 中添加插件，在需要的页面引入js
  (Notes for use: add a plug-in in the small program app.json, and introduce js into the required page )

  * "plugins": {
      "WechatSI": {                       // 插件名称
        "version": "0.3.3",               // 插件版本
        "provider": "wx069ba97219f66d99"  // 插件appid
      }
    }

  * 需要转换为语音的文字作为必要参数传入: AudioContext.AudioContext(参数);
  (Text that needs to be converted to speech is passed in as a necessary parameter: AudioContext.AudioContext(params))
  * author: cxr
*/

const plugin = requirePlugin('WechatSI');

function AudioContext(content) {
  const innerAudioContext = wx.createInnerAudioContext();
  innerAudioContext.autoplay = true;
  innerAudioContext.stop();
  plugin.textToSpeech({
    lang: "zh_CN",
    tts: true,
    content: content,
    success: function(res) {

      console.log(res);
      // console.log("succ tts", res.filename);
      innerAudioContext.src = res.filename;

      innerAudioContext.onPlay(() => {
        console.log('开始播放');

      })

      innerAudioContext.onStop(() => {
        console.log('i am onStop');
        innerAudioContext.stop();
        //播放停止，销毁该实例
        innerAudioContext.destroy();

      })

      innerAudioContext.onEnded(() => {
        console.log('i am onEnded');
        //播放结束，销毁该实例
        innerAudioContext.destroy();
        console.log('已执行destory()');
      })

      innerAudioContext.onError((res) => {
        /*  console.log(res.errMsg);
         console.log(res.errCode); */
        innerAudioContext.destroy();
      })

    },
    fail: function(res) {
      console.log("fail tts", res)
    }
  })
}

module.exports = {
  AudioContext: AudioContext
}
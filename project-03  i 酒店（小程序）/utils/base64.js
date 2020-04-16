const FILE_BASE_NAME = 'faceId'; //自定义文件名

function base64src(base64data, cb) {
  const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
  if (!format) {
    return (new Error('ERROR_BASE64SRC_PARSE'));
  }
  const filePath = `${wx.env.USER_DATA_PATH}/${FILE_BASE_NAME}.${format}`;
  const buffer = wx.base64ToArrayBuffer(bodyData);
  wx.getFileSystemManager().writeFile({
    filePath,
    data: buffer,
    encoding: 'binary',
    success() { 
      cb(filePath); // 返回图片地址
    },
    fail() {
      return (new Error('ERROR_BASE64SRC_WRITE'));
    },
  });
};

export { base64src };
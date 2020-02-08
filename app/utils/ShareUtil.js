const { NativeModules } = require('react-native');

/**
 * @param {String} text 分享内容
 * @param {String} img 图片地址，可以为链接，本地地址以及res图片（如果使用res,请使用如下写法：res/icon.png）
 * @param {String} url 分享链接，可以为空
 * @param {String} title 分享链接的标题
 * @param {Number} platform 平台id, 0:QQ, 1:SINA, 2:微信, 3:朋友圈
 */
const Share = (text, img, url, title, platform) => new Promise((resolve, reject) => {
  NativeModules.UMShareModule.share(text, img, url, title, platform, (code, message) => {
    if (code === 200) {
      resolve(message);
    } else {
      reject(message === 'cancel' ? '' : message);
    }
  });
});

export default Share;

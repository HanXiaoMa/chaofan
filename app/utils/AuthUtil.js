import { Platform } from 'react-native';

const { NativeModules } = require('react-native');

/**
 * @param {Number} platform 平台id, 0:QQ, 1:SINA, 2:微信
 */
const Auth = platform => new Promise((resolve, reject) => {
  NativeModules.UMShareModule.auth(platform, (code, result, message) => {
    if (Platform.OS === 'ios' && code === 200) {
      resolve(result);
    }
    if (code === 0 && Platform.OS === 'android') {
      resolve(result);
    }
    reject(message === 'cancel' ? '' : message);
  });
});

export default Auth;

/* eslint-disable prefer-promise-reject-errors */
import AliyunOSS from 'aliyun-oss-react-native';

AliyunOSS.initWithPlainTextAccessKey('**********',
  '**********', '**********');// 阿里云认证信息，后端太懒所以写在前端了

const uploadOss = (ossPath, localPath) => new Promise((resolve, reject) => {
  AliyunOSS.asyncUpload('drop-online', ossPath, localPath).then(() => {
    resolve(true);
  }).catch(() => {
    reject(false);
  });
});

export {
  uploadOss,
};

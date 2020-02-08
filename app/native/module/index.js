import { NativeModules } from 'react-native';

const wxPayModule = NativeModules.Wxpay;
const alipayModule = NativeModules.Alipay;
const wxAppId = 'wx41175020089e71e5';
export {
  wxPayModule,
  wxAppId,
  alipayModule,
};

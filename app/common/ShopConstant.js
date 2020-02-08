const baseURL = require('../../app.json').webUrl;
// 分享参团BaseURL
const SHARE_BASE_URL = `${baseURL}/panicbuyingWithFriend`;
// 无团者抢到宝贝分享
const SHARE_BASE_URL_BUYED = `${baseURL}/buysuccess`;
// 购买成功分享
const SHARE_BYU_SUCCESS_URL = `${baseURL}/buysuccess`;
// 上架中分享
const SHARE_ON_SALE = `${baseURL}/shareMyShoese`;
// 分享内容
const SHARE_TEXT = 'Drop让球鞋更简单！';
// 首页
const HOME = 'all';
// 原价发售
const ORIGIN_CONST = '1';
// Drop自营
const SELF_SUPPORT = '2';
// 球鞋锦鲤
const LUCKY_CHARM = '3';
// 球鞋预定
const RESERVE = '4';
// 抽签
const DRAW = '1';
// 抢购
const BUY = '2';
// 未参加
const NOT_JOIN = 0;
// 已参加，团长
const LEADING = 1;
// 已参加，团员
const MEMBER = 2;

// 支付订单
const PAY_ORDER = 1;
// 支付佣金
const PAY_COMMISSION = 2;
// 支付邮费
const PAY_POSTAGE = 3;

// 支付方式
// 支付宝
const ALIPAY = 0;
// 微信
const WECHATPAY = 1;
// Drop平台
const DROPPAY = 2;

// 支付完成
const FINISHPAY = 'finish_pay';

// DeviceEventEmitter.key
const REFRESH_SHOP_DETAIL_INFO = 'REFRESH_SHOP_DETAIL_INFO';
export default {
  SHARE_BASE_URL,
  SHARE_BASE_URL_BUYED,
  SHARE_TEXT,
  HOME,
  ORIGIN_CONST,
  SELF_SUPPORT,
  LUCKY_CHARM,
  RESERVE,
  DRAW,
  BUY,
  NOT_JOIN,
  LEADING,
  MEMBER,
  PAY_COMMISSION,
  PAY_ORDER,
  PAY_POSTAGE,
  ALIPAY,
  WECHATPAY,
  DROPPAY,
  REFRESH_SHOP_DETAIL_INFO,
  FINISHPAY,
  SHARE_BYU_SUCCESS_URL,
  SHARE_ON_SALE,
};

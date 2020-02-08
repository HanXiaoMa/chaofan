import { request } from '../../http/Axios';
import { alipayModule, wxPayModule } from '../../native/module';
import ShopConstant from '../../common/ShopConstant';
import { showToast } from '../../utils/MutualUtil';
import Strings from '../../res/Strings';
import { fetchSimpleData } from './simpleData';
import { showNoPayment } from '../../utils/CommonUtils';

/**
 * 获取订单信息并调用支付
 * @param type 支付类型 1订单 2佣金 3邮费
 * @param chooseWay 支付方式 1 支付宝 2 微信 3 drop平台
 * @param order_id 订单支付时传值(order_id) 佣金支付时传值(u_a_id) 邮费支付时传值(o_g_id)
 * @returns {Promise<*>}
 */
const toPay = async (type, chooseWay, order_id) => {
  const params = {
    order_id,
    type,
  };
  let url = '';
  if (chooseWay === ShopConstant.ALIPAY) {
    url = '/pay/getAlipayOrder';
  } else if (chooseWay === ShopConstant.WECHATPAY) {
    url = '/pay/getWechatOrder';
  }
  const res = await request(url, { params });
  const payResult = await pay(chooseWay, res.data);
  return payResult;
};

const pay = async (chooseWay, data) => {
  let result;
  if (ShopConstant.ALIPAY === chooseWay) {
    result = await alipay(data);
  } else if (ShopConstant.WECHATPAY === chooseWay) {
    result = await wechatPay(data);
  }
  return result;
};

const wechatPay = async (data) => {
  const isSupported = await wxPayModule.isSupported();
  if (!isSupported) {
    showToast('找不到微信应用，请安装最新版微信');
    return;
  }
  const res = await wxPayModule.pay(data.data);
  const status = res.errCode;
  if (status == -2) {
    return showToast('已取消本次支付');
  }
  return ShopConstant.FINISHPAY;
};

const alipay = async (data) => {
  const res = await alipayModule.pay(data);
  if (res) {
    const status = res.resultStatus;
    if (status == 6001) {
      return showToast('已取消本次支付');
    }
    if (status == 6002) {
      return showToast(Strings.netError);
    }
    return ShopConstant.FINISHPAY;
  }
};

/**
 * 获取支付状态
 * @param {String} uAid - 团ID
 * @param {Number} type - 支付类型
 * @param navigation
 * @param {Object} shopInfo - 商品详情
 */
const getPayStatus = (type, uAid, navigation, shopInfo, payType, successCallback) => async (dispatch) => {
  const params = {
    u_a_id: uAid,
    type,
  };
  const res = await request('/pay/get_pay_status', { params });
  if (res.data == 1) {
    window.waitPay = null;
    if (shopInfo?.activity?.id) {
      dispatch(fetchSimpleData('activityInfo', { id: shopInfo.activity.id }, 'refresh'));
    }
    showToast('支付成功');
    if (successCallback) {
      successCallback();
    } else if (shopInfo) {
      navigation.navigate('PaySuccess', {
        params: {
          shopInfo, type, payType,
        },
      });
    } else {
      navigation.navigate('MyGoods', {
        title: '我的库房',
        params: {
          type: 'warehouse',
        },
      });
    }
  } else {
    showToast('支付失败，请重新支付');
    showNoPayment();
  }
};
export { toPay, pay, getPayStatus };

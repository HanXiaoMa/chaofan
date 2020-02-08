import {
  View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView, Clipboard,
} from 'react-native';
import React from 'react';
import { StackActions, NavigationActions } from 'react-navigation';
import {
  showModalbox, closeModalbox, showShare, showToast,
} from './MutualUtil';
import { YaHei } from '../res/FontFamily';
import Image from '../components/Image';
import { store } from '../../App';
import { toLogIn, receiveUser, getUser } from '../redux/actions/userInfo';
import { fetchSimpleData } from '../redux/actions/simpleData';
import { fetchListData } from '../redux/actions/listData';
import { fetchAddress } from '../redux/actions/address';

const baseURL = require('../../app.json').webUrl;

const sizes = Array(26).fill('').map((v, i) => i / 2 + 35.5);
export const debounce = (fun, delay = 1000) => (...params) => {
  if (!fun.timer || Date.now() - fun.timer > delay) {
    fun.timer = Date.now();
    fun(...params);
  }
};

export const changeVersion = (text) => {
  const userInfo = getUserInfo();
  if (userInfo.isTestMember && text === '炒饭') {
    if (userInfo.isTestVersion) {
      showToast('成功切换到线上版');
    } else {
      showToast('成功切换到测试版');
    }
    store.dispatch(receiveUser({ isTestVersion: !userInfo.isTestVersion }));
    store.dispatch(getUser());
    resetRoute([
      {
        routeName: 'BottomNavigator',
        params: {
          params: {
            index: userInfo.isTestVersion ? 2 : 1,
          },
        },
      },
    ]);
  }
};

export const debounceDelay = (fun, delay = 350) => (...params) => {
  if (fun.timer) {
    clearTimeout(fun.timer);
  }
  fun.timer = setTimeout(() => {
    fun(...params);
  }, delay);
};

export const splitPhone = (str) => {
  if (!str || str.length < 1) {
    return [];
  }
  const arr1 = str.split(/\d{11}/);
  const arr2 = str.match(/\d{11}/g) || [];
  const arr3 = [];
  arr1.forEach((v, i) => {
    arr3.push(v);
    arr2[i] && arr3.push(arr2[i]);
  });
  return arr3;
};

export const formatDate = (time, format = 'yyyy-MM-dd hh:mm:ss') => {
  if (!time) { return ''; }
  const fullTime = new Date(time * 1000);
  return format
    .replace('yyyy', fullTime.getFullYear())
    .replace('MM', `${fullTime.getMonth() + 1}`.padStart(2, 0))
    .replace('dd', `${fullTime.getDate()}`.padStart(2, 0))
    .replace('hh', `${fullTime.getHours()}`.padStart(2, 0))
    .replace('mm', `${fullTime.getMinutes()}`.padStart(2, 0))
    .replace('ss', `${fullTime.getSeconds()}`.padStart(2, 0));
};

export const formatTimeAgo = (time) => {
  const now = Date.now() / 1000;
  const diff = now - time;
  if (diff < 60) {
    return '刚刚';
  } if (diff < 3600) {
    return `${parseInt(diff / 60)}分钟前`;
  } if (diff < 3600 * 24) {
    return `${parseInt(diff / 3600)}小时前`;
  }
  return formatDate(time);
};

export const showNoPayment = () => {
  showModalbox({
    element: (
      <View style={styles.modal}>
        <Text style={styles.hint}>友情提示</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 17 }}>
          <Text style={{ fontSize: 14, fontFamily: YaHei, lineHeight: 17 }}>
            支付未完成，可在我的库房
            <Text
              style={styles.kufang}
              onPress={() => {
                window.chaofunNavigation.navigate('MyGoods', {
                  title: '我的库房',
                  params: {
                    type: 'uncomplete',
                  },
                });
                closeModalbox();
              }}
            >
              待付款
            </Text>
            中继续支付
          </Text>
        </View>
        <TouchableOpacity
          hitSlop={{
            top: 20, left: 20, right: 20, bottom: 20,
          }}
          onPress={() => closeModalbox()}
          style={styles.cha}
        >
          <Image source={require('../res/image/close-x.png')} style={{ height: 12, width: 12 }} />
        </TouchableOpacity>
      </View>
    ),
  });
};

export const showChooseSize = (height, onChoosed, onClosed) => {
  showModalbox({
    element: (
      <ScrollView contentContainerStyle={styles.sizeModal}>
        {
          sizes.map(v => (
            <TouchableOpacity
              onPress={() => onChoosed(v)}
              key={v}
              style={[styles.itemWrapper, { borderRightColor: '#F2F2F2', borderBottomColor: '#F2F2F2' }]}
            >
              <Text>{v}</Text>
            </TouchableOpacity>
          ))
        }
      </ScrollView>
    ),
    options: {
      style: {
        height,
        width: SCREEN_WIDTH,
        marginTop: 10,
        backgroundColor: '#fff',
        ...Platform.select({
          ios: {
            shadowColor: 'rgb(166, 166, 166)',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.35,
            shadowRadius: 5,
          },
          android: {
            elevation: 5,
            position: 'relative',
          },
        }),
      },
      position: 'bottom',
      backdropOpacity: 0,
      onClosed,
    },
  });
};

export const shareAcyivity = (shopInfo, payType) => {
  const notPay = !payType && (shopInfo.is_join === 0 || shopInfo.user_activity.commission < 1);
  const aId = shopInfo.activity?.id;
  const uAId = shopInfo.user_activity?.id;
  const uId = shopInfo.user_activity?.user_id;
  const isDraw = shopInfo.activity.b_type === '1';
  let baseUrl = `${baseURL}/panicbuyingWithFriend`;
  let url = `${baseUrl}?id=${aId}&u_a_id=${uAId}&activity_id=${aId}&inviter=${uId}&pay=${notPay ? 0 : 1}`;
  let title = notPay ? `我在炒饭APP上发现了一个${isDraw ? '抽签' : '抢购'}活动，快来参与吧` : isDraw
    ? `快来炒饭APP帮我抽一支幸运签，中签可立获${shopInfo.user_activity.commission / 100}元现金`
    : `快来炒饭APP帮我助攻抢购，成功可立获${shopInfo.user_activity.commission / 100}元现金`;
  if (payType === 'buyActivityGoods') {
    baseUrl = `${baseURL}/buysuccess`;
    url = `${baseUrl}?id=${shopInfo.order_id}`;
    title = '快来看我在炒饭APP上抢到的潮鞋';
  }
  showShare({
    text: shopInfo.goods.goods_name,
    img: shopInfo.goods.icon,
    url,
    title,
  }).then(() => {
    // 分享成功回调
  });
};

export const getAppOptions = () => store.getState().simpleData?.appOptions?.data;

export const getAddress = () => store.getState().address.current;

export const getAuctionTags = () => store.getState().simpleData?.auctionBanner?.data?.goods_type || [];

export const getUserInfo = () => store.getState().userInfo;

export const getMyAuctionShop = () => store.getState().listData?.auctionMyshop;

export const resetRoute = (actions) => {
  if (actions.length > 1) {
    const lastAction = actions.pop();
    const resetAction = StackActions.reset({
      index: actions.length - 1,
      actions: actions.map(v => NavigationActions.navigate(v)),
    });
    window.chanfanNavigation.dispatch(resetAction);
    window.chanfanNavigation.push(lastAction.routeName, lastAction.params);
  } else {
    const resetAction = StackActions.reset({
      index: actions.length - 1,
      actions: actions.map(v => NavigationActions.navigate(v)),
    });
    window.chanfanNavigation.dispatch(resetAction);
  }
};

export const checkAuth = (currentRoute, action) => new Promise((resolve, reject) => {
  if (store.getState().userInfo.user_s_id) {
    action && window.chanfanNavigation.navigate(action);
    resolve();
  } else {
    store.dispatch(toLogIn(() => {
      const actions = [...window.chanfanNavigation.dangerouslyGetParent().state.routes, action];
      if (action) {
        resetRoute(actions);
      } else {
        window.chanfanNavigation.navigate(currentRoute);
      }
      resolve();
    }, () => {
      window.chanfanNavigation.navigate(currentRoute);
      reject();
    }));
  }
});

export const getGoodsOnSale = () => store.getState().listData?.goodsOnSale;

export const fetchOptions = (reLoad) => {
  store.dispatch(fetchSimpleData('appOptions', { user_id: getUserInfo().id }));
  store.dispatch(fetchAddress());
  if (reLoad) {
    if (store.getState().listData?.activityNotice) {
      store.dispatch(fetchListData('activityNotice', { type: 1 }));
    }
  }
};

export const toServer = () => {
  window.chaofunNavigation.navigate('Web', {
    title: '客服中心',
    params: {
      url: 'https://v1.live800.com/live800/chatClient/chatbox.jsp?companyID=1288733'
      + '&configID=47991&jid=4165914525&lan=zh&subject=%E5%92%A8%E8%AF%A2&prechatinfoexist=1&s=1',
    },
  });
};

export const copy = (type) => {
  const text = {
    address: `收件人：${getAppOptions()?.link_name}
手机号码：${getAppOptions()?.mobile}
邮寄地址：${getAppOptions()?.address}`,
    wx: getAppOptions()?.wx,
  }[type];
  const hint = {
    address: '邮寄信息已复制',
    wx: '微信号已复制',
  }[type];
  Clipboard.setString(text);
  showToast(hint);
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    borderRadius: 2,
    overflow: 'hidden',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 35,
    paddingBottom: 38,
  },
  kufang: {
    fontSize: 14,
    fontFamily: YaHei,
    color: '#37B6EB',
    textAlign: 'right',
  },
  cha: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  hint: {
    fontSize: 20,
    fontFamily: YaHei,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 27,
  },
  sizeModal: {
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  itemWrapper: {
    width: '25%',
    height: SCREEN_WIDTH / 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
});

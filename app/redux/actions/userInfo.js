import { createAction } from 'redux-actions';
import { request } from '../../http/Axios';
import AuthUtil from '../../utils/AuthUtil';
import { showToast } from '../../utils/MutualUtil';
import { update } from '../../utils/UpdateUtil';
import { fetchOptions } from '../../utils/CommonUtils';

const receiveAuth = createAction('RECEIVE_AUTH');
const setMessageSendFlag = createAction('SET_MESSAGE_SEND_FLAG');
const receiveUser = createAction('RECEIVE_USER');
const resetUser = createAction('RESET_USER');
const receiveIosNativeDeviceId = createAction('RECEIVE_IOS_NATIVE_DEVICE_ID');

// 第三方登录
function thirdPartyLogin(i) {
  return dispatch => new Promise((resolve) => {
    AuthUtil(i).then((wxRes) => {
      const sex = {
        男: 1,
        女: 2,
        1: 1,
        2: 2,
      }[wxRes.gender] || -1;
      const params = {
        unionid: wxRes.unionid,
        openid: wxRes.openid,
      };
      request('/user/wx_login', { params, showLoading: true }).then((res) => {
        if (res?.data?.user_s_id) {
          dispatch(receiveUser(res.data));
          resolve(res.data);
        } else {
          dispatch(receiveUser({
            user_s_id: res.data.user_s_id,
            user_name: wxRes.name,
            sex,
            avatar: wxRes.iconurl,
            unionid: wxRes.unionid,
            openid: wxRes.openid,
          }));
          update();
          fetchOptions(true);
          resolve(res.data);
        }
      });
    }).catch((err) => {
      showToast(err);
    });
  });
}

// 短信登录
function messageAuth(mobile, codes) {
  return dispatch => new Promise((resolve) => {
    request('/user/login', {
      params: { mobile, codes },
      showLoading: true,
    }).then((res) => {
      dispatch(receiveUser(res.data.user_name ? res.data : { ...res.data, mobile }));
      if (res.data.user_name) {
        update();
        fetchOptions(true);
      }
      resolve(true);
    });
  });
}

// 手机绑定微信
function weChatBind(i) {
  return dispatch => new Promise((resolve) => {
    AuthUtil(i).then((wxRes) => {
      const params = {
        unionid: wxRes.unionid,
        openid: wxRes.openid,
      };
      request('/user/up_wx', { params, showLoading: true }).then(() => {
        dispatch(receiveUser({ wx_openid: wxRes.openid, wx_unionid: wxRes.unionid }));
        resolve();
      });
    }).catch(() => {
      showToast('绑定失败，请稍后重试');
    });
  });
}

// 微信绑定手机号
function wxBindMobile(mobile, codes) {
  return (dispatch, getState) => new Promise((resolve) => {
    const {
      sex = -1, user_name, avatar, unionid, openid,
    } = getState().userInfo;
    request('/user/do_set_wx', {
      showLoading: true,
      params: {
        mobile, codes, unionid, openid, user_name, avatar, sex,
      },
    }).then((res) => {
      dispatch(receiveUser({
        user_s_id: res.data.user_s_id,
      }));
      resolve();
    });
  });
}

// 手机号换绑
function mobileBind(mobile, codes) {
  return () => new Promise((resolve) => {
    request('/user/up_mobile', { params: { mobile, codes }, showLoading: true }).then(() => {
      resolve();
    });
  });
}

// 发送验证码
function sendMessage(api, mobile, sendTime = 0) {
  return dispatch => new Promise((resolve, reject) => {
    request(api, {
      params: { mobile },
      showLoading: true,
    }).then(() => {
      dispatch(setMessageSendFlag({ sendTime, sendPhone: mobile }));
      resolve();
    }).catch(() => {
      dispatch(setMessageSendFlag({ sendTime: 0, sendPhone: '' }));
      reject();
    });
  });
}

// 更新用户信息
function updateUser(params) {
  return (dispatch, getState) => new Promise((resolve) => {
    const {
      sex: sexState, age, size, user_name, avatar,
    } = getState().userInfo;
    const sex = {
      男: 1,
      女: 2,
      1: 1,
      2: 2,
    }[params.sex || sexState] || -1;
    request('/user/n_register', {
      params: {
        age, size, user_name, avatar, ...params, sex,
      },
      showLoading: true,
    }).then((res) => {
      dispatch(receiveUser(res.data));
      resolve();
    });
  });
}

// 获取用户信息
function getUser() {
  return dispatch => new Promise((resolve) => {
    request('/user/userinfo', { params: { uid: -1 } }).then((res) => {
      dispatch(receiveUser(res.data));
      resolve();
    });
  });
}

// 前往登录
function toLogIn(successCallback, closeCallback) {
  return (dispatch) => {
    dispatch(resetUser());
    window.chanfanNavigation.navigate('Auth', { params: { successCallback, closeCallback } });
  };
}

// 创建支付密码
function setPassword(password) {
  return dispatch => new Promise((resolve) => {
    const params = {
      password,
      enter_password: password,
    };
    request('/user/p_register', { params, showLoading: true }).then(() => {
      dispatch(receiveUser({ password: true }));
      resolve();
    });
  });
}

// 修改支付密码
function updatePassword(password, new_password) {
  return dispatch => new Promise((resolve) => {
    const params = {
      new_password,
      new_enter_password: new_password,
      password,
    };
    request('/user/change_password', { params, showLoading: true }).then(() => {
      dispatch(receiveUser({ password: true }));
      resolve();
    });
  });
}

export {
  receiveAuth, sendMessage, setMessageSendFlag, messageAuth, updateUser, getUser,
  receiveUser, receiveIosNativeDeviceId, thirdPartyLogin, resetUser, weChatBind, toLogIn,
  setPassword, updatePassword, mobileBind, wxBindMobile,
};

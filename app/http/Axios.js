import Axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';
import { Platform, PixelRatio } from 'react-native';
import { showToast, hideToastLoading, showToastLoading } from '../utils/MutualUtil';
import Strings from '../res/Strings';
import { sortObj } from '../utils/SortUtil';
import { md5 } from '../utils/Md5Util';
import api from './api';
import { errorTrack } from '../utils/ErrorUtil';
import { getUserInfo } from '../utils/CommonUtils';

const appJson = require('../../app.json');

const pixelRatio = PixelRatio.get();

const appVersion = DeviceInfo.getVersion();
const deviceInfo = {
  'Unique-Id': `${DeviceInfo.getUniqueId()}`,
  'App-Version': `${appVersion}`,
  System: `${DeviceInfo.getSystemName()}`,
  'Device-Brand': `${escape(DeviceInfo.getBrand())}`,
  Platform: Platform.OS,
  'Device-Id': `${DeviceInfo.getDeviceId()}`,
};

const fetchErrorList = [];
const timeout = 10000;
const getHeaders = () => ({
  ...deviceInfo,
  Authorization: getUserInfo().user_s_id,
});

// 监听网络变化
const netListener = NetInfo.addEventListener((state) => {
  if (state.isConnected) {
    for (const i in fetchErrorList) {
      fetchErrorList[i]();
      delete fetchErrorList[i];
    }
  }
});

// 移除网络监听
const removeNetListener = () => {
  netListener();
};

/**
 * 发送请求
 * 除了url，其他都是可选参数;结合实际业务，可提出部分可选参数为必传参数，如：params
 * @param {String} url
 * @param {String} method - 请求方式 ex:post、get
 * @param {Object} params - 请求体
 * @param type
 * @returns {Promise<*>}
 */
const request = (url, { params = {}, showLoading = false } = {}) => new Promise((resolve, reject) => {
  const baseURL = getUserInfo().isTestVersion ? appJson.testApiUrl : appJson.releaseApiUrl;
  const action = () => {
    const data = {
      ...params,
      timestamp: Date.now(),
      device_width: SCREEN_WIDTH * pixelRatio,
      image_size_times: params.image_size_times || -1,
    };
    showLoading && showToastLoading();
    const token = md5(encodeURIComponent(sortObj(data)));
    const headers = getHeaders();
    Axios.get(baseURL + url, {
      timeout,
      headers,
      params: { ...data, token },
    }).then((response) => {
      // console.log(data, baseURL + url, response.data);
      if (response.data.callbackCode === 1) {
        resolve(response.data);
      } else {
        if (__DEV__) { console.log(response.data, `${baseURL}${url}`, url, headers, data); }
        if (response.data.callbackMsg && response.data.callbackMsg !== '用户未登录') {
          showToast(response.data.callbackMsg);
        }
        reject();
      }
    }).catch((error) => {
      if (__DEV__) { console.log(error.message, data, `${baseURL}${url}`, error, headers); } else {
        errorTrack(error.message, JSON.stringify({
          url: `${baseURL}${url}`,
          params: data,
          userInfo: getUserInfo(),
          headers,
        }), false);
      }
      if (error.response?.status === 500) {
        showToast('服务器开了小差，请稍后再试');
      } else {
        NetInfo.fetch().then((netState) => {
          if (!netState.isConnected) {
            showToast(Strings.netError);
            const hash = url + JSON.stringify(params);
            if (!fetchErrorList[hash]) {
              fetchErrorList[hash] = action;
            }
          }
        });
      }
    }).finally(() => {
      hideToastLoading();
    });
  };
  action();
});

const upload = (url, data) => {
  const formdata = new FormData();
  const baseURL = getUserInfo().isTestVersion ? appJson.testApiUrl : appJson.releaseApiUrl;
  data.timestamp = Date.now();
  for (const i in data) {
    if (i === 'avatar') {
      formdata.append('avatar', { uri: data[i], name: 'avatar.png', type: 'multipart/form-data' });
      delete data[i];
    } else {
      formdata.append(i, data[i]);
    }
  }
  formdata.append('token', md5(encodeURIComponent(sortObj(data))));
  return new Promise((resolve, reject) => {
    Axios.post(`${baseURL}${url}`, formdata, { headers: getHeaders() }).then((res) => {
      if (res.data.callbackCode === 1) {
        resolve(res.data);
        return;
      }
      if (__DEV__) { console.log(res.data); }
      showToast(res.data.callbackMsg);
      throw new Error(res.data.callbackMsg);
    }).catch((err) => {
      reject(err);
    });
  });
};

const requestApi = (type, params) => request(api[type].url, params);

export {
  request, upload, removeNetListener, requestApi,
};

import { DeviceEventEmitter } from 'react-native';
import GlobalComponent from './GlobalComponent';

function triggerEvent(type, params, isShow) {
  DeviceEventEmitter.emit('dropstoreGlobal', {
    chaoFunEventType: type,
    params,
    isShow,
  });
}

function addCallbackListener(type, resolve, reject) {
  const listener = DeviceEventEmitter.addListener('chaoFunCallback', (e) => {
    if (e.chaoFunEventType === type) {
      listener.remove();
      if (e.type === 'success') {
        resolve(e.data);
      } else {
        reject(e.data);
      }
    }
  });
}

// 分享弹窗
export const showShare = (params: { text: String, img:String, url: String, title: String }) => new Promise((resolve, reject) => {
  triggerEvent('share', params, true);
  addCallbackListener('share', resolve, reject);
});

/**
 * 弹窗react-native-modalbox
 * @param {element} element - react-native Dom元素/组件
 * @param {Object} options - react-native-modalbox的props
 */
export const showModalbox = ({ element, options }) => {
  GlobalComponent.showModalbox({ element, options });
};
export const closeModalbox = (immediately) => {
  GlobalComponent.closeModalbox(null, immediately);
};

// Toast加载框
export const showToastLoading = (options = { duration: 5000, text: '加载中' }) => {
  triggerEvent('toastLoading', options, true);
};
export const hideToastLoading = (immediately) => {
  triggerEvent('toastLoading', immediately);
};

// Toast提示
export const showToast = (text: String) => {
  GlobalComponent.showToast({ text });
};

// ActionSheet
export const showActionSheet = (data = { options: Array, cancelButtonIndex: Number, onPress: () => {} }) => {
  data && triggerEvent('actionSheet', data, true);
};

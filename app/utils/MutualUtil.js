import React from 'react';
import GlobalComponent from './GlobalComponent';
import ShareCom from '../components/ShareCom';
import { PADDING_TAB } from '../common/Constant';

// 分享弹窗
export const showShare = (params: { text: String, img:String, url: String, title: String }) => new Promise((resolve, reject) => {
  GlobalComponent.showModalbox({
    element: <ShareCom data={params} resolve={resolve} reject={reject} />,
    options: {
      position: 'bottom',
      style: {
        height: 138 + PADDING_TAB,
      },
    },
  });
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
  GlobalComponent.showToastLoading(options);
};
export const hideToastLoading = () => {
  GlobalComponent.hideToastLoading();
};

// Toast提示
export const showToast = (text: String) => {
  GlobalComponent.showToast({ text });
};

// ActionSheet
export const showActionSheet = (data) => {
  GlobalComponent.showActionSheet(data);
};

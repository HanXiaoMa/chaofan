import React from 'react';
import { Clipboard } from 'react-native';
import { showToast, showModalbox, closeModalbox } from './MutualUtil';
import { request } from '../http/Axios';
import { ModalNormal } from '../components';
import { fetchListData, changeListData } from '../redux/actions/listData';
import { fetchSimpleData } from '../redux/actions/simpleData';
import { store } from '../../App';
import { toServer } from './CommonUtils';

export const btnOnPress = (item, type, successCallback) => {
  if (type === 'server') {
    Clipboard.setString(item.order_id);
    showToast('订单号已复制到粘贴板');
    toServer();
  } else if (type === 'confirmHaved') {
    showModalbox({
      element: (<ModalNormal
        sure={() => {
          request('/auction/confirm_auction', { params: { order_id: item.order_id } }).then(() => {
            successCallback && successCallback();
            closeModalbox();
            store.dispatch(fetchListData('auctionBuyerWaitHave', {}, 'refresh'));
          });
        }}
        text="是否确认收货？"
      />),
    });
  } else if (type === 'delete') {
    showModalbox({
      element: (<ModalNormal
        sure={() => {
          request('/auction/del_auction', { params: { id: item.id } }).then(() => {
            closeModalbox();
            store.dispatch(fetchListData('auctionSellerHistory', {}, 'refresh'));
          });
        }}
        text="是否删除该拍品？"
      />),
    });
  } else if (type === 'inputOrder') {
    window.chaofunNavigation.navigate('AuctionInputOrder', {
      params: {
        item,
        successCallback: () => {
          store.dispatch(fetchListData('auctionSellerWaitSendOut', {}, 'refresh'));
        },
      },
    });
  } else if (type === 'edit') {
    window.chaofunNavigation.navigate('AuctionPublish', { params: { item } });
  } else if (type === 'putOn') {
    request('/auction/up_shelf', { params: { id: item.id } }).then((res) => {
      window.chaofunNavigation.navigate('Pay', {
        params: {
          payData: res.data,
          successCallback: () => {
            store.dispatch(fetchListData('auctionSellerHistory', {}, 'refresh'));
            window.chaofunNavigation.navigate('AuctionGoods', { params: { type: 'auctionSellerHistory' } });
          },
        },
      });
    });
  } else if (type === 'cancel') {
    showModalbox({
      element: (<ModalNormal
        sure={() => {
          request('/auction/down_shelf', { params: { id: item.id } }).then(() => {
            closeModalbox();
            store.dispatch(fetchListData('auctionSellerHistory', {}, 'refresh'));
          });
        }}
        text="是否取消拍卖该商品？"
      />),
    });
  } else if (type === 'pay') {
    window.chaofunNavigation.navigate('AuctionOrderDetail', {
      params: {
        item,
        successCallback: () => {
          fetchSimpleData('auctionBuyerWaitPayNum');
        },
      },
    });
  }
};

export const itemOnPress = (item, toOrderDetail) => {
  if (toOrderDetail) {
    window.chaofunNavigation.navigate('AuctionOrderDetail', {
      params: {
        item, isView: true,
      },
    });
  } else {
    window.chaofunNavigation.push('AuctionDetail', {
      params: {
        item,
      },
    });
  }
};

export const removeFocusItem = (item) => {
  if (store.getState().listData?.auctionMyFocus) {
    store.dispatch(changeListData('auctionMyFocus', data => ({ ...data, list: data.list.filter(v => v.user_id != item.user_id) })));
  }
};

export const addFocusItem = (item) => {
  if (store.getState().listData?.auctionMyFocus) {
    store.dispatch(changeListData('auctionMyFocus', data => ({ ...data, list: [{ ...item, is_attention: 1 }, ...data.list] })));
  }
};

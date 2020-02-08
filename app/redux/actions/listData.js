import { createAction } from 'redux-actions';
import { request } from '../../http/Axios';
import api from '../../http/api';

const receiveListData = createAction('RECEIVE_LIST_DATA', a => a, (a, type) => ({ type }));
const requestListData = createAction('REQUEST_LIST_DATA');
const resetListData = createAction('RESET_LIST_DATA', a => a, (a, needClear) => ({ needClear }));

function fetchListData(type = '', query = {}, fetchType: 'more' | 'refresh' = null) {
  return (dispatch, getState) => {
    const storeData = getState().listData[type];
    if (fetchType === 'refresh' && !storeData) {
      return;
    }
    const listData = storeData || {};
    if ((Date.now() - listData.lastFetchTime < 500) || (listData.currentPage >= listData.totalPages && fetchType === 'more')) {
      return;
    }
    if (fetchType !== 'more') {
      dispatch(resetListData(type, !fetchType));
    }
    const page = fetchType === 'more' ? listData.currentPage + 1 : 1;
    const params = {
      ...api[type].initParams,
      pn: page,
      ...query,
    };
    dispatch(requestListData(type));
    request(api[type].url, { params }).then((res) => {
      dispatch(receiveListData({ ...res.data, currentPage: page }, type));
    });
  };
}

function changeListData(type = '', callback) {
  return (dispatch, getState) => {
    dispatch(receiveListData(callback(getState().listData[type] || {}), type));
  };
}

export {
  fetchListData, receiveListData, requestListData, resetListData, changeListData,
};

import { createAction } from 'redux-actions';
import { request } from '../../http/Axios';
import api from '../../http/api';

const receiveSimpleData = createAction('RECEIVE_SIMPLE_DATA', a => a, (a, type) => ({ type }));
const requestSimpleData = createAction('REQUEST_SIMPLE_DATA', a => a, (a, needClear, defaultValue) => ({ needClear, defaultValue }));
const resetAllSimpleData = createAction('RESET_ALL_SIMPLE_DATA');
const resetSimpleData = createAction('RESET_SIMPLE_DATA');

function fetchSimpleData(type = '', query = {}, fetchType: 'reload' | 'refresh' = null, defaultValue) {
  return dispatch => new Promise((resolve) => {
    dispatch(requestSimpleData(type, fetchType === 'reload', defaultValue));
    const params = {
      ...api[type].initParams,
      ...query,
    };
    request(api[type].url, { params }).then((res) => {
      dispatch(receiveSimpleData({ data: res.data, fetchedParams: query, isFetched: true }, type));
      resolve(res.data);
    });
  });
}

function changeSimpleData(type = '', data = {}) {
  return (dispatch, getState) => dispatch(receiveSimpleData({ ...getState().simpleData[type], data: { ...getState().simpleData[type].data, ...data } }, type));
}

export {
  fetchSimpleData, receiveSimpleData, requestSimpleData, resetAllSimpleData, changeSimpleData, resetSimpleData,
};

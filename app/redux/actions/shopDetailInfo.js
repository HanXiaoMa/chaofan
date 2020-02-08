import { createAction } from 'redux-actions';
import { request } from '../../http/Axios';
import { showToast } from '../../utils/MutualUtil';

const receiveShoesList = createAction('RECEIVE_SHOP_SHOE_LIST');

/**
 * 获取鞋码数据
 * @param shopId
 * @returns {Function}
 */
function getShoesList(shopId) {
  return dispatch => new Promise((resolve) => {
    const params = {
      id: shopId,
    };
    request('/activity/activity_size', { params }).then((res) => {
      const data = res.data;
      if (!(data && data.length)) {
        return showToast('暂无数据');
      }
      dispatch(receiveShoesList(data));
      resolve(data);
    });
  });
}

export { receiveShoesList, getShoesList };

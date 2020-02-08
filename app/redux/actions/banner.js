import { createAction } from 'redux-actions';
import { request } from '../../http/Axios';

const receiveBanner = createAction('RECEIVE_BANNER', a => a, (a, type) => ({ type }));

function fetchBanner(type) {
  return (dispatch) => {
    request('/activity/activity_banner', { params: { type, image_size_times: 1 } }).then((res) => {
      dispatch(receiveBanner(res.data.banner, type));
    });
  };
}

export {
  receiveBanner, fetchBanner,
};

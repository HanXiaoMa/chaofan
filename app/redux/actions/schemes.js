import { createAction } from 'redux-actions';
import { Linking } from 'react-native';

const receiveSchemes = createAction('RECEIVE_SCHEMES');

const isAppInstalled = scheme => Linking.canOpenURL(scheme.url);
// 检测用户是否安装app
function updateSchemes() {
  return (dispatch, getState) => {
    const schemes = getState().schemes.schemes;
    Promise.all(schemes.map(scheme => isAppInstalled(scheme))).then((supports) => {
      dispatch(receiveSchemes(schemes.map((v, i) => ({ ...v, supported: supports[i] }))));
    });
  };
}

export {
  updateSchemes, receiveSchemes,
};

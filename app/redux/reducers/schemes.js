import { handleActions } from 'redux-actions';
import { receiveSchemes } from '../actions/schemes';

const initialState = {
  schemes: [{
    id: 'wechat',
    name: '微信',
    url: 'weixin://',
    supported: false,
    share: ['wx', 'pyq'],
    loginIcon: require('../../res/image/wxLogin.png'),
    authId: 2,
  }],
};

export default handleActions({
  [receiveSchemes]: (state, action) => ({
    ...state,
    schemes: action.payload,
  }),
}, initialState);

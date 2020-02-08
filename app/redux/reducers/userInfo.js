import { handleActions } from 'redux-actions';
import {
  receiveAuth, setMessageSendFlag, receiveUser, receiveIosNativeDeviceId, resetUser,
} from '../actions/userInfo';

const initialState = {
  avatar: -1,
  id: -1,
  isTestVersion: true,
};

export default handleActions({
  [receiveAuth]: (state, action) => ({ ...state, auth_token: action.payload.auth_token }),

  [setMessageSendFlag]: (state, action) => ({
    ...state,
    sendTime: action.payload.sendTime || state.sendTime,
    sendPhone: action.payload.sendPhone || state.sendPhone,
  }),

  [receiveUser]: (state, action) => ({
    ...state,
    ...action.payload,
    sex: { 1: '男', 2: '女' }[action.payload.sex],
  }),

  [resetUser]: state => ({
    ...initialState,
    isTestVersion: state.isTestVersion,
    isAgreeTreaty: state.isAgreeTreaty,
  }),

  [receiveIosNativeDeviceId]: (state, action) => ({ ...state, iosNativeDeviceId: action.payload }),
}, initialState);

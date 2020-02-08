import { createSelector } from 'reselect';

const getUserInfo = createSelector(
  state => state.userInfo,
  value => value,
);
const getAuthToken = createSelector(
  state => state.userInfo.auth_token,
  value => value,
);

export {
  getUserInfo, getAuthToken,
};

import { createSelector } from 'reselect';

const getListData = createSelector(
  (state, type) => state.listData[type] || {},
  value => value,
);
const getPartData = createSelector(
  (state, type, key) => (state.listData[type] || {})[key],
  value => value,
);

export { getListData, getPartData };

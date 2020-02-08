import { createSelector } from 'reselect';

const getSimpleData = createSelector(
  (state, type) => state.simpleData[type] || {},
  value => value,
);

export { getSimpleData };

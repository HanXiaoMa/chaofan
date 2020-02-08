import { createSelector } from 'reselect';

const getSchemes = createSelector(
  state => state.schemes.schemes,
  value => value,
);

export { getSchemes };

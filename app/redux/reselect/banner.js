import { createSelector } from 'reselect';

const getBanner = createSelector(
  (state, type) => state.banner[type],
  value => value,
);

export { getBanner };

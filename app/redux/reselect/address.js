import { createSelector } from 'reselect';

const getAddress = createSelector(
  state => state.address,
  value => value,
);

export { getAddress };

import { createSelector } from 'reselect';

const getReShoesList = createSelector(
  state => state.shopDetailInfo.shoesData,
  value => value,
);
export {
  getReShoesList,
};

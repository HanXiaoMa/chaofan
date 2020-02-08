import { handleActions } from 'redux-actions';
import { receiveShoesList } from '../actions/shopDetailInfo';

const initShopInfo = {
  shopData: {
    error: false,
    data: {},
  },
  shoesData: {
    shoesList: [],
  },
};
const actions = {};
actions[receiveShoesList] = (state, actions) => ({
  ...state,
  shoesData: {
    shoesList: actions.payload,
  },
});

const reducer = handleActions(
  actions, initShopInfo,
);
export default reducer;

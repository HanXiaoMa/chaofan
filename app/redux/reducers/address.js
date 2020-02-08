import { handleActions } from 'redux-actions';
import { receiveAddress, setChoosedAddress } from '../actions/address';

const initialState = {
  list: [],
  current: {},
  isChoosed: false,
  isFetched: false,
};

export default handleActions({
  [receiveAddress]: (state, action) => ({
    ...state,
    list: action.payload,
    current: action.payload.find(v => v.is_default) || action.payload[0],
    isFetched: true,
  }),
  [setChoosedAddress]: (state, action) => ({
    ...state,
    current: action.payload,
    isChoosed: true,
  }),
}, initialState);

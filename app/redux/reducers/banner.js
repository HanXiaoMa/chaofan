import { handleActions } from 'redux-actions';
import { receiveBanner } from '../actions/banner';

const initialState = {
};

export default handleActions({
  [receiveBanner]: (state, action) => ({
    ...state,
    [`banner${action.meta.type}`]: action.payload,
  }),
}, initialState);

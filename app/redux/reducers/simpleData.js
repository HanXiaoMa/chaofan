import { handleActions } from 'redux-actions';
import {
  receiveSimpleData, requestSimpleData, resetAllSimpleData, resetSimpleData,
} from '../actions/simpleData';

export default handleActions({
  [resetSimpleData]: (state, action) => ({
    ...state,
    [action.payload]: {},
  }),
  [requestSimpleData]: (state, action) => ({
    ...state,
    [action.payload]: action.meta.needClear ? {}
      : action.meta.defaultValue ? { data: action.meta.defaultValue }
        : state[action.payload],
  }),
  [receiveSimpleData]: (state, action) => ({
    ...state,
    [action.meta.type]: {
      data: action.payload.data,
      fetchedParams: action.payload.fetchedParams,
      isFetched: action.payload.isFetched,
    },
  }),
  [resetAllSimpleData]: () => ({}),
}, {});

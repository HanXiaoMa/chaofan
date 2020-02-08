import { handleActions } from 'redux-actions';
import { receiveListData, requestListData, resetListData } from '../actions/listData';

export default handleActions({
  [requestListData]: (state, action) => ({
    ...state,
    [action.payload]: {
      ...state[action.payload],
      lastFetchTime: Date.now(),
    },
  }),
  [receiveListData]: (state, action) => ({
    ...state,
    [action.meta.type]: {
      ...action.payload,
      list: action.payload.currentPage === 1 ? action.payload.list : [...(state[action.meta.type].list || []), ...action.payload.list],
      lastFetchTime: null,
      totalPages: action.payload.number,
      currentPage: action.payload.currentPage,
    },
  }),
  [resetListData]: (state, action) => ({
    ...state,
    [action.payload]: {
      ...state[action.payload],
      list: action.meta.needClear ? [] : (state[action.payload]?.list || []),
      lastFetchTime: null,
      totalPages: -1,
      currentPage: 1,
    },
  }),
}, {});

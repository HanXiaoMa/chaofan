import { combineReducers } from 'redux';
import userInfo from './userInfo';
import shopDetailInfo from './shopDetailInfo';
import banner from './banner';
import address from './address';
import listData from './listData';
import simpleData from './simpleData';
import schemes from './schemes';

export default combineReducers({
  userInfo,
  shopDetailInfo,
  banner,
  address,
  listData,
  simpleData,
  schemes,
});

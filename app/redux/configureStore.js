import thunkMiddleware from 'redux-thunk';
// eslint-disable-next-line no-unused-vars
import loggerMiddleware from 'redux-logger';
import AsyncStorage from '@react-native-community/async-storage';
import { compose, createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import reducers from './reducers';

let middlewares;
if (__DEV__) {
  middlewares = applyMiddleware(thunkMiddleware);
  // middlewares = applyMiddleware(thunkMiddleware, loggerMiddleware);
} else {
  middlewares = applyMiddleware(thunkMiddleware);
}
const store = createStore(persistReducer({
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['userInfo'],
}, reducers), undefined, compose(middlewares));

const persistor = persistStore(store);
if (__DEV__ && !!window.navigator.userAgent) {
  window.store = store;
}

export default store;
export { persistor };

import JPush from 'jpush-react-native';
import { updateUser } from '../redux/actions/userInfo';
import { store } from '../../App';
import { getUserInfo } from './CommonUtils';

const init = (onIndexChange) => {
  const userInfo = getUserInfo();
  // JPush.setLoggerEnable(true);
  JPush.getRegistrationID((result) => {
    if (userInfo.user_s_id && userInfo.jpush_id !== result.registerID) {
      store.dispatch(updateUser({ jpush_id: result.registerID }));
    }
  });

  const notificationListener = (res) => {
    try {
      if (res.notificationEventType === 'notificationOpened') {
        // notificationOpened 点击推送消息触发
        if (!window.chanfanNavigation) { return; }
        const { extras: { type, routeParams, routeName } } = res;
        if (type === 'route') {
          // 跳转
          const params = JSON.parse(routeParams);
          if (routeName === 'BottomNavigator') {
            onIndexChange(params.index);
          } else {
            window.chanfanNavigation.navigate(routeName, { params });
          }
        } else if (type === 'modal') {
          // 显示弹窗
        } else if (type === 'toast') {
          // 显示提示语
        }
      } else if (res.notificationEventType === 'notificationArrived') {
        // notificationArrived 收到推送消息触发
      }
    } catch (err) {
      console.log(err);
    }
  };

  JPush.addNotificationListener(notificationListener);
};

export default JPush;
export { init };

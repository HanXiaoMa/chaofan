import Axios from 'axios';
import { Platform } from 'react-native';
import app from '../../app.json';

export const errorTrack = (message, stack, is_fatal) => {
  Axios.get('http://api-test.chaofun.co/error/add_error_catch', {
    params: {
      message,
      stack,
      is_fatal: { true: 1, false: 0 }[is_fatal],
      version: `${app.versionName}-${app.versionCode}-${Platform.OS === 'ios' ? app.versionIosPush : app.versionAndroidPush}`,
    },
  });
};
